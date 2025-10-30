import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { z } from 'zod';

const explainCodeRequestSchema = z.object({
  code: z.string().min(1, "Code is required"),
  language: z.string(),
});

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

async function explainCode(
  code: string,
  language: string
): Promise<{ explanation: string; message: string }> {
  try {
    const systemMessage = `You are an expert programming instructor specialized in explaining code clearly and comprehensively.
Analyze the provided ${language} code and provide a detailed explanation that includes:
1. Overview: What the code does overall
2. Step-by-step breakdown: Explain each important part
3. Key concepts: Highlight important programming concepts used
4. Best practices: Note any good practices or potential improvements

Provide the explanation in a clear, educational format with proper formatting.
Use Arabic language for the explanation to make it accessible.`;

    const userMessage = `Please explain this ${language} code:\n\n${code}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
      max_tokens: 2048,
    });

    const explanation = response.choices[0].message.content?.trim() || "";

    return {
      explanation,
      message: "Code explained successfully",
    };
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    throw new Error(error.message || "Failed to explain code");
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
