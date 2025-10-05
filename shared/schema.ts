import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull(),
  organizationName: text("organization_name"),
  phoneNumber: text("phone_number"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const foodListings = pgTable("food_listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  restaurantId: varchar("restaurant_id").notNull().references(() => users.id),
  foodName: text("food_name").notNull(),
  description: text("description"),
  quantity: integer("quantity").notNull(),
  unit: text("unit").notNull(),
  foodType: text("food_type").notNull(),
  pickupTimeStart: timestamp("pickup_time_start").notNull(),
  pickupTimeEnd: timestamp("pickup_time_end").notNull(),
  location: text("location").notNull(),
  status: text("status").notNull().default('available'),
  createdAt: timestamp("created_at").defaultNow(),
});

export const foodClaims = pgTable("food_claims", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  foodListingId: varchar("food_listing_id").notNull().references(() => foodListings.id),
  claimedById: varchar("claimed_by_id").notNull().references(() => users.id),
  claimedAt: timestamp("claimed_at").defaultNow(),
  pickupStatus: text("pickup_status").notNull().default('pending'),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertFoodListingSchema = createInsertSchema(foodListings).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertFoodClaimSchema = createInsertSchema(foodClaims).omit({
  id: true,
  claimedAt: true,
  completedAt: true,
});

export const insertContactSchema = createInsertSchema(contactSubmissions).pick({
  name: true,
  email: true,
  message: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFoodListing = z.infer<typeof insertFoodListingSchema>;
export type FoodListing = typeof foodListings.$inferSelect;
export type InsertFoodClaim = z.infer<typeof insertFoodClaimSchema>;
export type FoodClaim = typeof foodClaims.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
