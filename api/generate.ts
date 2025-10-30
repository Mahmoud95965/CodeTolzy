import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { z } from 'zod';

const generateCodeRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  language: z.string(),
  currentCode: z.string().optional(),
});

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

async function generateCode(
  prompt: string,
  language: string,
  currentCode?: string
): Promise<{ code: string; message: string }> {
  try {
    const systemMessage = `You are an expert programming assistant specialized in generating clean, efficient, and well-documented code. 
Generate code in ${language} based on the user's request.
Return ONLY the code without explanations, markdown formatting, or code blocks.
The code should be production-ready and follow best practices.`;

    const userMessage = currentCode
      ? `Current code:\n${currentCode}\n\nRequest: ${prompt}\n\nModify the existing code or add to it based on the request.`
      : `Generate ${language} code for: ${prompt}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
      max_tokens: 2048,
    });

    const generatedCode = response.choices[0].message.content?.trim() || "";

    let cleanCode = generatedCode;
    if (cleanCode.startsWith("```")) {
      cleanCode = cleanCode.replace(/^```[\w]*\n/, "").replace(/\n```$/, "");
    }

    return {
      code: cleanCode,
      message: "Code generated successfully",
    };
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    throw new Error(error.message || "Failed to generate code");
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
}
