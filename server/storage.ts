import { 
  type User, 
  type InsertUser, 
  type ContactSubmission, 
  type InsertContact,
  type FoodListing,
  type InsertFoodListing,
  type FoodClaim,
  type InsertFoodClaim,
  users,
  contactSubmissions,
  foodListings,
  foodClaims
} from "@shared/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, and, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import createMemoryStore from "memorystore";
import { Pool } from "@neondatabase/serverless";
import { promisify } from "util";
import { scrypt, randomBytes } from "crypto";

const hasDatabase = Boolean(process.env.DATABASE_URL);

// Only initialize DB clients if a DATABASE_URL exists
const pool = hasDatabase ? new Pool({ connectionString: process.env.DATABASE_URL! }) : undefined as any;
const sql = hasDatabase ? neon(process.env.DATABASE_URL!) : undefined as any;
export const db = hasDatabase ? drizzle(sql) : undefined as any;

const PostgresSessionStore = connectPg(session);
const MemStore = createMemoryStore(session);

export interface IStorage {
  sessionStore: session.SessionStore;
  
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsersByRole?(role: string): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  createContactSubmission(contact: InsertContact): Promise<ContactSubmission>;
  
  createFoodListing(listing: InsertFoodListing): Promise<FoodListing>;
  getFoodListings(status?: string): Promise<FoodListing[]>;
  getFoodListingsByRestaurant(restaurantId: string): Promise<FoodListing[]>;
  getFoodListing(id: string): Promise<FoodListing | undefined>;
  updateFoodListingStatus(id: string, status: string): Promise<void>;
  
  createFoodClaim(claim: InsertFoodClaim): Promise<FoodClaim>;
  getFoodClaimsByUser(userId: string): Promise<FoodClaim[]>;
  getFoodClaimsByListing(listingId: string): Promise<FoodClaim[]>;
  updateClaimStatus(id: string, status: string): Promise<void>;
  
  getAnalytics(): Promise<{
    totalMealsSaved: number;
    activeRestaurants: number;
    activeVolunteers: number;
    totalListings: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool: pool as any,
      createTableIfMissing: true 
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }
  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role));
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createContactSubmission(insertContact: InsertContact): Promise<ContactSubmission> {
    const result = await db.insert(contactSubmissions).values(insertContact).returning();
    return result[0];
  }

  async createFoodListing(listing: InsertFoodListing): Promise<FoodListing> {
    const result = await db.insert(foodListings).values(listing).returning();
    return result[0];
  }

  async getFoodListings(status?: string): Promise<FoodListing[]> {
    if (status) {
      return await db.select().from(foodListings).where(eq(foodListings.status, status)).orderBy(desc(foodListings.createdAt));
    }
    return await db.select().from(foodListings).orderBy(desc(foodListings.createdAt));
  }

  async getFoodListingsByRestaurant(restaurantId: string): Promise<FoodListing[]> {
    return await db.select().from(foodListings).where(eq(foodListings.restaurantId, restaurantId)).orderBy(desc(foodListings.createdAt));
  }

  async getFoodListing(id: string): Promise<FoodListing | undefined> {
    const result = await db.select().from(foodListings).where(eq(foodListings.id, id)).limit(1);
    return result[0];
  }

  async updateFoodListingStatus(id: string, status: string): Promise<void> {
    await db.update(foodListings).set({ status }).where(eq(foodListings.id, id));
  }

  async createFoodClaim(claim: InsertFoodClaim): Promise<FoodClaim> {
    const result = await db.insert(foodClaims).values(claim).returning();
    return result[0];
  }

  async getFoodClaimsByUser(userId: string): Promise<FoodClaim[]> {
    return await db.select().from(foodClaims).where(eq(foodClaims.claimedById, userId)).orderBy(desc(foodClaims.claimedAt));
  }

  async getFoodClaimsByListing(listingId: string): Promise<FoodClaim[]> {
    return await db.select().from(foodClaims).where(eq(foodClaims.foodListingId, listingId)).orderBy(desc(foodClaims.claimedAt));
  }

  async updateClaimStatus(id: string, status: string): Promise<void> {
    await db.update(foodClaims).set({ 
      pickupStatus: status,
      completedAt: status === 'completed' ? new Date() : undefined
    }).where(eq(foodClaims.id, id));
  }

  async getAnalytics(): Promise<{
    totalMealsSaved: number;
    activeRestaurants: number;
    activeVolunteers: number;
    totalListings: number;
  }> {
    const completedClaims = await db.select().from(foodClaims).where(eq(foodClaims.pickupStatus, 'completed'));
    
    const restaurantUsers = await db.select().from(users).where(eq(users.role, 'restaurant'));
    
    const volunteerUsers = await db.select().from(users).where(eq(users.role, 'volunteer'));
    const ngoUsers = await db.select().from(users).where(eq(users.role, 'ngo'));
    
    const allListings = await db.select().from(foodListings);
    
    const totalMeals = completedClaims.reduce((sum, claim) => {
      const listing = allListings.find(l => l.id === claim.foodListingId);
      return sum + (listing?.quantity || 0);
    }, 0);

    return {
      totalMealsSaved: totalMeals,
      activeRestaurants: restaurantUsers.length,
      activeVolunteers: volunteerUsers.length + ngoUsers.length,
      totalListings: allListings.length,
    };
  }
}

class MemoryStorage implements IStorage {
  sessionStore: session.SessionStore;

  private users: User[] = [];
  private listings: FoodListing[] = [];
  private claims: FoodClaim[] = [];
  private contacts: ContactSubmission[] = [];
  private reviews: Array<{ id: string; subjectId: string; subjectType: 'restaurant'|'ngo'; rating: number; comment?: string; createdAt: Date; }> = [];

  constructor() {
    this.sessionStore = new MemStore({ checkPeriod: 86400000 });
    void this.seedDemoData();
  }

  private async hashPassword(password: string) {
    const scryptAsync = promisify(scrypt);
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  }

  private uuid() {
    // Simple UUID v4-ish for demo
    return (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`) as string;
  }

  private async seedDemoData() {
    const restaurant: User = {
      id: this.uuid(),
      username: "demo_restaurant",
      email: "restaurant@example.com",
      password: await this.hashPassword("password123"),
      role: "restaurant",
      organizationName: "Green Bites",
      phoneNumber: "+1-555-1010",
      address: "123 Market St, Springfield",
      createdAt: new Date(),
    };
    const volunteer: User = {
      id: this.uuid(),
      username: "demo_volunteer",
      email: "volunteer@example.com",
      password: await this.hashPassword("password123"),
      role: "volunteer",
      organizationName: "Helping Hands",
      phoneNumber: "+1-555-2020",
      address: "456 Elm St, Springfield",
      createdAt: new Date(),
    };
    const ngo: User = {
      id: this.uuid(),
      username: "demo_ngo",
      email: "ngo@example.com",
      password: await this.hashPassword("password123"),
      role: "ngo",
      organizationName: "Food Bridge",
      phoneNumber: "+1-555-3030",
      address: "789 Oak Ave, Springfield",
      createdAt: new Date(),
    };
    this.users.push(restaurant, volunteer, ngo);

    const now = new Date();
    const two = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const four = new Date(now.getTime() + 4 * 60 * 60 * 1000);

    const l1: FoodListing = {
      id: this.uuid(),
      restaurantId: restaurant.id,
      foodName: "Fresh Veggie Bowls",
      description: "Assorted vegetable bowls with quinoa and chickpeas",
      quantity: 20,
      unit: "meals",
      foodType: "vegetarian" as any,
      pickupTimeStart: two,
      pickupTimeEnd: four,
      location: "Green Bites, 123 Market St",
      status: "available",
      createdAt: new Date(),
    };
    const l2: FoodListing = {
      id: this.uuid(),
      restaurantId: restaurant.id,
      foodName: "Chicken Sandwiches",
      description: "Leftover grilled chicken sandwiches",
      quantity: 15,
      unit: "meals",
      foodType: "non-vegetarian" as any,
      pickupTimeStart: two,
      pickupTimeEnd: four,
      location: "Green Bites, 123 Market St",
      status: "available",
      createdAt: new Date(),
    };
    this.listings.push(l1, l2);

    const claim1: FoodClaim = {
      id: this.uuid(),
      foodListingId: l1.id,
      claimedById: volunteer.id,
      claimedAt: new Date(),
      pickupStatus: "pending",
      completedAt: null as any,
      notes: "Will arrive around pickup window start",
    };
    this.claims.push(claim1);
    l1.status = "claimed";

    const l3: FoodListing = {
      id: this.uuid(),
      restaurantId: restaurant.id,
      foodName: "Pasta Trays",
      description: "Two trays of tomato basil pasta",
      quantity: 12,
      unit: "meals",
      foodType: "vegetarian" as any,
      pickupTimeStart: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      pickupTimeEnd: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      location: "Green Bites, 123 Market St",
      status: "claimed",
      createdAt: new Date(),
    };
    this.listings.push(l3);
    const c2: FoodClaim = {
      id: this.uuid(),
      foodListingId: l3.id,
      claimedById: ngo.id,
      claimedAt: new Date(),
      pickupStatus: "completed",
      completedAt: new Date(),
      notes: "Picked up and distributed",
    };
    this.claims.push(c2);

    this.contacts.push({
      id: this.uuid(),
      name: "Demo User",
      email: "demo@example.com",
      message: "Excited to partner to reduce food waste!",
      createdAt: new Date(),
    });
  }

  async getUser(id: string): Promise<User | undefined> { return this.users.find(u => u.id === id); }
  async getUserByUsername(username: string): Promise<User | undefined> { return this.users.find(u => u.username === username); }
  async getUserByEmail(email: string): Promise<User | undefined> { return this.users.find(u => u.email === email); }
  async getUsersByRole(role: string): Promise<User[]> { return this.users.filter(u => u.role === role); }
  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { ...insertUser, id: this.uuid(), createdAt: new Date() } as User;
    this.users.push(user);
    return user;
  }
  async createContactSubmission(insertContact: InsertContact): Promise<ContactSubmission> {
    const c: ContactSubmission = { ...insertContact, id: this.uuid(), createdAt: new Date() } as ContactSubmission;
    this.contacts.push(c);
    return c;
  }
  async createFoodListing(listing: InsertFoodListing): Promise<FoodListing> {
    const l: FoodListing = { ...listing, id: this.uuid(), createdAt: new Date(), status: "available" } as FoodListing;
    this.listings.unshift(l);
    return l;
  }
  async getFoodListings(status?: string): Promise<FoodListing[]> {
    const arr = [...this.listings];
    if (!status) return arr.sort((a, b) => (b.createdAt?.getTime?.() ?? 0) - (a.createdAt?.getTime?.() ?? 0));
    return arr.filter(l => l.status === status).sort((a, b) => (b.createdAt?.getTime?.() ?? 0) - (a.createdAt?.getTime?.() ?? 0));
  }
  async getFoodListingsByRestaurant(restaurantId: string): Promise<FoodListing[]> {
    return this.listings.filter(l => l.restaurantId === restaurantId).sort((a, b) => (b.createdAt?.getTime?.() ?? 0) - (a.createdAt?.getTime?.() ?? 0));
  }
  async getFoodListing(id: string): Promise<FoodListing | undefined> { return this.listings.find(l => l.id === id); }
  async updateFoodListingStatus(id: string, status: string): Promise<void> {
    const l = this.listings.find(x => x.id === id); if (l) l.status = status as any;
  }
  async createFoodClaim(claim: InsertFoodClaim): Promise<FoodClaim> {
    const c: FoodClaim = { ...claim, id: this.uuid(), claimedAt: new Date(), pickupStatus: claim.pickupStatus as any } as FoodClaim;
    this.claims.unshift(c);
    return c;
  }
  async getFoodClaimsByUser(userId: string): Promise<FoodClaim[]> { return this.claims.filter(c => c.claimedById === userId); }
  async getFoodClaimsByListing(listingId: string): Promise<FoodClaim[]> { return this.claims.filter(c => c.foodListingId === listingId); }
  async updateClaimStatus(id: string, status: string): Promise<void> {
    const c = this.claims.find(x => x.id === id); if (c) { c.pickupStatus = status as any; c.completedAt = status === "completed" ? new Date() : (undefined as any); }
  }
  async getAnalytics(): Promise<{ totalMealsSaved: number; activeRestaurants: number; activeVolunteers: number; totalListings: number; }> {
    const completedClaims = this.claims.filter(c => c.pickupStatus === 'completed');
    const totalMeals = completedClaims.reduce((sum, claim) => {
      const listing = this.listings.find(l => l.id === claim.foodListingId);
      return sum + (listing?.quantity || 0);
    }, 0);
    return {
      totalMealsSaved: totalMeals,
      activeRestaurants: this.users.filter(u => u.role === 'restaurant').length,
      activeVolunteers: this.users.filter(u => u.role === 'volunteer' || u.role === 'ngo').length,
      totalListings: this.listings.length,
    };
  }

  // Reviews helpers for public UX demo
  async getReviews() { return this.reviews; }
  async addReview(review: { subjectId: string; subjectType: 'restaurant'|'ngo'; rating: number; comment?: string; }) {
    if (review.rating < 1 || review.rating > 5) throw new Error('Rating must be 1-5');
    const r = { id: this.uuid(), createdAt: new Date(), ...review };
    this.reviews.unshift(r);
    return r;
  }
}

export const storage: IStorage = hasDatabase ? new DatabaseStorage() : new MemoryStorage();
