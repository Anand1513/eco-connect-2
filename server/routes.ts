import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
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

  const httpServer = createServer(app);
  return httpServer;
}
