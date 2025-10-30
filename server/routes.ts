import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateCodeRequestSchema, explainCodeRequestSchema } from "@shared/schema";
import { generateCode, explainCode } from "./lib/openai";
import aiRoutes from "./routes-ai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register AI routes
  app.use(aiRoutes);

  // Code generation endpoint (legacy support)
  app.post("/api/generate", async (req, res) => {
    try {
      const result = generateCodeRequestSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          error: "Invalid request", 
          details: result.error.issues 
        });
      }

      const { prompt, language, currentCode } = result.data;

      const response = await generateCode(prompt, language, currentCode);

      return res.json(response);
    } catch (error: any) {
      console.error("Generate code error:", error);
      return res.status(500).json({ 
        error: error.message || "Failed to generate code" 
      });
    }
  });

  // Code explanation endpoint (legacy support)
  app.post("/api/explain", async (req, res) => {
    try {
      const result = explainCodeRequestSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          error: "Invalid request", 
          details: result.error.issues 
        });
      }

      const { code, language } = result.data;

      const response = await explainCode(code, language);

      return res.json(response);
    } catch (error: any) {
      console.error("Explain code error:", error);
      return res.status(500).json({ 
        error: error.message || "Failed to explain code" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
