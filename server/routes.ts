import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, DatabaseStorage } from "./storage";
import { insertContactSchema, insertFoodListingSchema, insertFoodClaimSchema } from "@shared/schema";
import { setupAuth } from "./auth";
import { supabase, supabaseAdmin } from "./supabase";
import { promisify } from "util";
import { scrypt, randomBytes } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contactSubmission = await storage.createContactSubmission(validatedData);
      
      console.log("Contact form submission received:", {
        id: contactSubmission.id,
        name: contactSubmission.name,
        email: contactSubmission.email,
        message: contactSubmission.message,
        createdAt: contactSubmission.createdAt,
      });
      // Attempt to mirror contact submissions to Supabase (if configured)
      if (supabase) {
        try {
          await supabase
            .from("contact_submissions")
            .insert({
              id: contactSubmission.id,
              name: contactSubmission.name,
              email: contactSubmission.email,
              message: contactSubmission.message,
              created_at: contactSubmission.createdAt?.toISOString?.() ?? new Date().toISOString(),
            });
        } catch (e) {
          console.warn("Supabase insert (contact_submissions) failed:", (e as Error).message);
        }
      }
      
      res.status(201).json({
        success: true,
        message: "Contact form submitted successfully",
        id: contactSubmission.id,
      });
    } catch (error) {
      console.error("Error processing contact form:", error);
      res.status(400).json({
        success: false,
        message: "Invalid form data",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Supabase SSO bridge: verify access token, ensure user, create session
  app.post("/api/sso/supabase", async (req, res, next) => {
    try {
      const accessToken = String(req.body.accessToken || "").trim();
      const desiredRole = String(req.body.role || "").trim() || "volunteer";
      const postedEmail = String(req.body.email || "").trim();
      if (!accessToken) return res.status(400).json({ error: "accessToken is required" });
      if (!supabase) return res.status(500).json({ error: "Supabase not configured" });

      const { data, error } = await supabase.auth.getUser(accessToken);
      if (error || !data?.user) {
        // In development, allow relaxed SSO using posted email
        const relaxed = String(process.env.ALLOW_DEV_SSO || "").toLowerCase() === "true";
        if (!relaxed || !postedEmail) {
          return res.status(401).json({ error: "Unauthorized", detail: error?.message || "Token invalid" });
        }
      }
      const supUser = data?.user as any;
      const email: string | undefined = supUser?.email ?? postedEmail;
      if (!email) return res.status(400).json({ error: "Email missing on Supabase account" });

      let user = await storage.getUserByEmail(email);
      if (!user) {
        const scryptAsync = promisify(scrypt);
        const salt = randomBytes(16).toString("hex");
        const buf = (await scryptAsync(randomBytes(24).toString("hex"), salt, 64)) as Buffer;
        const hashed = `${buf.toString("hex")}.${salt}`;
        const usernameBase = (email.split("@")[0] || "user").replace(/[^a-zA-Z0-9_]/g, "_");
        const username = usernameBase.slice(0, 24);
        user = await storage.createUser({
          username,
          email,
          password: hashed,
          supabaseUserId: supUser.id,
          role: desiredRole,
          organizationName: undefined as any,
          phoneNumber: undefined as any,
          address: undefined as any,
        } as any);
      } else if (supUser?.id && !user.supabaseUserId) {
        user = await storage.linkSupabaseUserId(user.id, supUser.id);
      }

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(200).json(user);
      });
    } catch (e) {
      next(e);
    }
  });

  // Supabase Register: auto-verify email using service role
  app.post("/api/register-supabase", async (req, res) => {
    try {
      if (!supabaseAdmin) return res.status(500).json({ error: "Supabase admin not configured" });
      const email = String(req.body.email || "").trim();
      const password = String(req.body.password || "").trim();
      const role = String(req.body.role || "").trim() || "volunteer";
      if (!email || !password) return res.status(400).json({ error: "Email and password required" });

      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role },
      });
      if (error) return res.status(400).json({ error: error.message });

      // Optionally create a local user record for immediate app use; will be linked on first login
      const existing = await storage.getUserByEmail(email);
      if (!existing) {
        const scryptAsync = promisify(scrypt);
        const salt = randomBytes(16).toString("hex");
        const buf = (await scryptAsync(randomBytes(24).toString("hex"), salt, 64)) as Buffer;
        const hashed = `${buf.toString("hex")}.${salt}`;
        const username = (email.split("@")[0] || "user").slice(0, 24);
        await storage.createUser({
          username,
          email,
          password: hashed,
          supabaseUserId: data.user?.id as any,
          role,
          organizationName: undefined as any,
          phoneNumber: undefined as any,
          address: undefined as any,
        } as any);
      }

      return res.status(201).json({ message: "User registered and verified", user: data.user });
    } catch (e) {
      return res.status(400).json({ error: e instanceof Error ? e.message : "Unknown error" });
    }
  });

  // Supabase Login: sign in and establish server session
  app.post("/api/login-supabase", async (req, res, next) => {
    try {
      const email = String(req.body.email || "").trim();
      const password = String(req.body.password || "").trim();
      if (!email || !password) return res.status(400).json({ error: "Email and password required" });
      if (!supabase) return res.status(500).json({ error: "Supabase not configured" });

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data?.session?.access_token) return res.status(401).json({ error: error?.message || "Unauthorized" });

      // Reuse SSO logic to link/create local user and set session
      const accessToken = data.session.access_token;
      const { data: userData, error: userErr } = await supabase.auth.getUser(accessToken);
      if (userErr || !userData?.user) return res.status(401).json({ error: userErr?.message || "Unauthorized" });
      const supUser = userData.user as any;
      const confirmedEmail = supUser.email as string;

      let user = await storage.getUserByEmail(confirmedEmail);
      if (!user) {
        const scryptAsync = promisify(scrypt);
        const salt = randomBytes(16).toString("hex");
        const buf = (await scryptAsync(randomBytes(24).toString("hex"), salt, 64)) as Buffer;
        const hashed = `${buf.toString("hex")}.${salt}`;
        const username = (confirmedEmail.split("@")[0] || "user").slice(0, 24);
        user = await storage.createUser({
          username,
          email: confirmedEmail,
          password: hashed,
          supabaseUserId: supUser.id,
          role: String(req.body.role || "volunteer"),
          organizationName: undefined as any,
          phoneNumber: undefined as any,
          address: undefined as any,
        } as any);
      } else if (!user.supabaseUserId && supUser?.id) {
        user = await storage.linkSupabaseUserId(user.id, supUser.id);
      }

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(200).json({ message: "Login successful", user });
      });
    } catch (e) {
      next(e);
    }
  });

  // Aliases to match Trae-style endpoints
  app.post("/api/register", (req, res) => res.redirect(307, "/api/register-supabase"));
  app.post("/api/login", (req, res) => res.redirect(307, "/api/login-supabase"));

  // Provisional register: create a local user row aligned with Supabase signup details
  app.post("/api/register/provisional", async (req, res) => {
    try {
      const email = String(req.body.email || "").trim();
      if (!email) return res.status(400).json({ error: "Email is required" });

      // if a user already exists, update basic profile
      let existing = await storage.getUserByEmail(email);
      if (existing) {
        const updated = await storage.updateUserProfile(existing.id, {
          username: req.body.username,
          role: req.body.role,
          organizationName: req.body.organizationName,
          phoneNumber: req.body.phoneNumber,
          address: req.body.address,
        });
        return res.json(updated);
      }

      const scryptAsync = promisify(scrypt);
      const salt = randomBytes(16).toString("hex");
      const buf = (await scryptAsync(randomBytes(24).toString("hex"), salt, 64)) as Buffer;
      const hashed = `${buf.toString("hex")}.${salt}`;
      const username = (String(req.body.username || "").trim() || email.split("@")[0]).slice(0, 24);

      const created = await storage.createUser({
        username,
        email,
        password: hashed,
        supabaseUserId: null as any,
        role: String(req.body.role || "volunteer"),
        organizationName: req.body.organizationName,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
      } as any);

      res.status(201).json(created);
    } catch (e) {
      res.status(400).json({ error: e instanceof Error ? e.message : "Unknown error" });
    }
  });

  app.post("/api/food-listings", async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== 'restaurant') {
      return res.status(403).send("Only restaurants can create food listings");
    }
    
    try {
      const validatedData = insertFoodListingSchema.parse({
        ...req.body,
        quantity: typeof req.body.quantity === 'string' ? parseInt(req.body.quantity, 10) : req.body.quantity,
        pickupTimeStart: req.body.pickupTimeStart ? new Date(req.body.pickupTimeStart) : undefined,
        pickupTimeEnd: req.body.pickupTimeEnd ? new Date(req.body.pickupTimeEnd) : undefined,
        restaurantId: req.user.id,
      });
      const listing = await storage.createFoodListing(validatedData);
      res.status(201).json(listing);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/food-listings", async (req, res) => {
    const status = req.query.status as string | undefined;
    const listings = await storage.getFoodListings(status);
    // Override demo addresses to requested location
    const address = "Knowledge Park 3, Sharda University, 201310";
    const transformed = listings.map((l) => ({ ...l, location: address }));
    res.json(transformed);
  });

  app.get("/api/food-listings/my", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }
    
    const listings = await storage.getFoodListingsByRestaurant(req.user.id);
    res.json(listings);
  });

  app.post("/api/food-claims", async (req, res) => {
    if (!req.isAuthenticated() || (req.user?.role !== 'volunteer' && req.user?.role !== 'ngo')) {
      return res.status(403).send("Only volunteers and NGOs can claim food");
    }
    
    try {
      const validatedData = insertFoodClaimSchema.parse({
        ...req.body,
        claimedById: req.user.id,
      });
      
      const listing = await storage.getFoodListing(validatedData.foodListingId);
      if (!listing || listing.status !== 'available') {
        return res.status(400).send("Food listing not available");
      }
      
      const claim = await storage.createFoodClaim(validatedData);
      await storage.updateFoodListingStatus(validatedData.foodListingId, 'claimed');
      
      res.status(201).json(claim);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Update current user's profile with fields aligned to DB columns
  app.post("/api/profile/update", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }
    try {
      const payload = {
        username: req.body.username ? String(req.body.username).trim() : undefined,
        role: req.body.role ? String(req.body.role).trim() : undefined,
        organizationName: req.body.organizationName ? String(req.body.organizationName).trim() : undefined,
        phoneNumber: req.body.phoneNumber ? String(req.body.phoneNumber).trim() : undefined,
        address: req.body.address ? String(req.body.address).trim() : undefined,
      };
      const updated = await storage.updateUserProfile(req.user.id, Object.fromEntries(Object.entries(payload).filter(([,v]) => v !== undefined)) as any);
      res.json(updated);
    } catch (e) {
      res.status(400).json({ error: e instanceof Error ? e.message : "Unknown error" });
    }
  });

  app.get("/api/food-claims/my", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }
    
    const claims = await storage.getFoodClaimsByUser(req.user.id);
    res.json(claims);
  });

  app.patch("/api/food-claims/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }
    
    try {
      const { status } = req.body;
      await storage.updateClaimStatus(req.params.id, status);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.get("/api/analytics", async (req, res) => {
    const analytics = await storage.getAnalytics();
    res.json(analytics);
  });

  // Public profiles (restaurants and NGOs)
  app.get("/api/public/profiles", async (_req, res) => {
    const restaurants = await storage.getUsersByRole?.("restaurant");
    const ngos = await storage.getUsersByRole?.("ngo");
    // Override demo profile addresses to requested location
    const restAddr = "Knowledge Park 3, Sharda University, 201310";
    const ngoAddr = "Knowledge Park 3, Sharda University, 201310";
    const transformedRestaurants = (restaurants || []).map(r => ({ ...r, address: restAddr }));
    const transformedNgos = (ngos || []).map(n => ({ ...n, address: ngoAddr }));
    res.json({ restaurants: transformedRestaurants, ngos: transformedNgos });
  });

  // Reviews - in-memory fallback via storage when DB missing
  app.get("/api/public/reviews", async (_req, res) => {
    const reviews = await (storage as any).getReviews?.();
    res.json(reviews || []);
  });

  app.post("/api/public/reviews", async (req, res) => {
    try {
      const saved = await (storage as any).addReview?.(req.body);
      if (!saved) return res.status(501).send("Reviews not supported in current storage");
      res.status(201).json(saved);
    } catch (e) {
      res.status(400).json({ error: e instanceof Error ? e.message : "Unknown error" });
    }
  });

  const httpServer = createServer(app);

  // Debug endpoints (development aid)
  app.get("/api/debug/storage", (_req, res) => {
    const mode = storage instanceof DatabaseStorage ? "database" : "memory";
    res.json({ mode });
  });

  app.get("/api/debug/user/:username", async (req, res) => {
    const username = String(req.params.username || "").trim();
    const user = await storage.getUserByUsername(username);
    res.json({ exists: Boolean(user), user });
  });

  return httpServer;
}
