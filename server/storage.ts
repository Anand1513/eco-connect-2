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

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
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

export const storage = new DatabaseStorage();
