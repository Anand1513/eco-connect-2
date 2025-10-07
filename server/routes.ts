import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertFoodListingSchema, insertFoodClaimSchema } from "@shared/schema";
import { setupAuth } from "./auth";

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
    res.json(listings);
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
    res.json({ restaurants: restaurants || [], ngos: ngos || [] });
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
  return httpServer;
}
