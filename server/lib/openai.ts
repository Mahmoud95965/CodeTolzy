import OpenAI from "openai";

// Using blueprint:javascript_openai integration
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export async function generateCode(
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
      model: "gpt-4o-mini", // Using gpt-4o-mini for cost efficiency
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
      max_tokens: 2048,
    });

    const generatedCode = response.choices[0].message.content?.trim() || "";

    // Remove markdown code blocks if present
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

export async function explainCode(
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
