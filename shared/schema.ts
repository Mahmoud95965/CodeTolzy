import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Code generation request/response types
export const generateCodeRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  language: z.string(),
  currentCode: z.string().optional(),
});

export type GenerateCodeRequest = z.infer<typeof generateCodeRequestSchema>;

export interface GenerateCodeResponse {
  code: string;
  message: string;
}

// Code explanation request/response types
export const explainCodeRequestSchema = z.object({
  code: z.string().min(1, "Code is required"),
  language: z.string(),
});

export type ExplainCodeRequest = z.infer<typeof explainCodeRequestSchema>;

export interface ExplainCodeResponse {
  explanation: string;
  message: string;
}
