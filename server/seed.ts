import { promisify } from "util";
import { scrypt, randomBytes } from "crypto";
import { db } from "./storage";
import {
  users,
  foodListings,
  foodClaims,
  contactSubmissions,
  type User,
} from "@shared/schema";
import { eq, sql } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to run the seed script");
  }

  console.log("Seeding database with demo data...");

  // Clean existing data (order matters due to FKs)
  await db.delete(foodClaims);
  await db.delete(foodListings);
  await db.delete(contactSubmissions);
  await db.delete(users);

  // Create demo users
  const [restaurantUser] = await db
    .insert(users)
    .values({
      username: "demo_restaurant",
      email: "restaurant@example.com",
      password: await hashPassword("password123"),
      role: "restaurant",
      organizationName: "Green Bites",
      phoneNumber: "+1-555-1010",
      address: "123 Market St, Springfield",
    })
    .returning();

  const [volunteerUser] = await db
    .insert(users)
    .values({
      username: "demo_volunteer",
      email: "volunteer@example.com",
      password: await hashPassword("password123"),
      role: "volunteer",
      organizationName: "Helping Hands",
      phoneNumber: "+1-555-2020",
      address: "456 Elm St, Springfield",
    })
    .returning();

  const [ngoUser] = await db
    .insert(users)
    .values({
      username: "demo_ngo",
      email: "ngo@example.com",
      password: await hashPassword("password123"),
      role: "ngo",
      organizationName: "Food Bridge",
      phoneNumber: "+1-555-3030",
      address: "789 Oak Ave, Springfield",
    })
    .returning();

  // Create sample listings for restaurant
  const now = new Date();
  const inTwoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const inFourHours = new Date(now.getTime() + 4 * 60 * 60 * 1000);

  const [listing1] = await db
    .insert(foodListings)
    .values({
      restaurantId: restaurantUser.id,
      foodName: "Fresh Veggie Bowls",
      description: "Assorted vegetable bowls with quinoa and chickpeas",
      quantity: 20,
      unit: "meals",
      foodType: "vegetarian",
      pickupTimeStart: inTwoHours,
      pickupTimeEnd: inFourHours,
      location: "Green Bites, 123 Market St",
      status: "available",
    })
    .returning();

  const [listing2] = await db
    .insert(foodListings)
    .values({
      restaurantId: restaurantUser.id,
      foodName: "Chicken Sandwiches",
      description: "Leftover grilled chicken sandwiches",
      quantity: 15,
      unit: "meals",
      foodType: "non-vegetarian",
      pickupTimeStart: inTwoHours,
      pickupTimeEnd: inFourHours,
      location: "Green Bites, 123 Market St",
      status: "available",
    })
    .returning();

  // Create a claim for one listing by volunteer
  const [claim1] = await db
    .insert(foodClaims)
    .values({
      foodListingId: listing1.id,
      claimedById: volunteerUser.id,
      pickupStatus: "pending",
      notes: "Will arrive around pickup window start",
    })
    .returning();

  // Mark the claimed listing as claimed
  await db.update(foodListings).set({ status: "claimed" }).where(eq(foodListings.id, listing1.id));

  // Completed claim by NGO for demonstration
  const [listing3] = await db
    .insert(foodListings)
    .values({
      restaurantId: restaurantUser.id,
      foodName: "Pasta Trays",
      description: "Two trays of tomato basil pasta",
      quantity: 12,
      unit: "meals",
      foodType: "vegetarian",
      pickupTimeStart: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      pickupTimeEnd: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      location: "Green Bites, 123 Market St",
      status: "available",
    })
    .returning();

  await db
    .insert(foodClaims)
    .values({
      foodListingId: listing3.id,
      claimedById: ngoUser.id,
      pickupStatus: "completed",
      notes: "Picked up and distributed",
    })
    .returning();

  await db.update(foodListings).set({ status: "claimed" }).where(eq(foodListings.id, listing3.id));

  // Add a demo contact submission
  await db.insert(contactSubmissions).values({
    name: "Demo User",
    email: "demo@example.com",
    message: "Excited to partner to reduce food waste!",
  });

  console.log("Seed completed.");
  console.log("Demo accounts:");
  console.log("- Restaurant: demo_restaurant / password123");
  console.log("- Volunteer:  demo_volunteer / password123");
  console.log("- NGO:        demo_ngo / password123");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


