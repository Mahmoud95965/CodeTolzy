import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();

// Check if OpenAI API key is configured
if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️  WARNING: OPENAI_API_KEY is not set. AI features will not work.');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
});

// AI Autocomplete endpoint
router.post('/api/autocomplete', async (req, res) => {
  try {
    const { code, language, position } = req.body;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an AI code completion assistant. Provide intelligent code suggestions for ${language}. Return only the completion text without explanations.`,
        },
        {
          role: 'user',
          content: `Complete this ${language} code:\n\n${code}\n\nProvide 3 possible completions for the current cursor position.`,
        },
      ],
      max_tokens: 150,
      temperature: 0.3,
    });

    const suggestions = completion.choices[0].message.content
      ?.split('\n')
      .filter(s => s.trim())
      .slice(0, 3) || [];

    res.json({ suggestions });
  } catch (error: any) {
    console.error('Autocomplete error:', error);
    res.status(500).json({ error: 'Failed to generate autocomplete suggestions' });
  }
});

// AI Debug endpoint
router.post('/api/debug', async (req, res) => {
  try {
    const { code, language } = req.body;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert code debugger. Analyze ${language} code for errors, bugs, and potential issues. Return a JSON array of errors with format: [{"line": number, "message": "error description", "fix": "corrected code line"}]`,
        },
        {
          role: 'user',
          content: `Analyze this ${language} code for errors:\n\n${code}`,
        },
      ],
      max_tokens: 1000,
      temperature: 0.2,
    });

    const content = completion.choices[0].message.content || '[]';
    let errors = [];
    
    try {
      errors = JSON.parse(content);
    } catch {
      // If not valid JSON, parse manually
      const lines = content.split('\n').filter(l => l.includes('line') || l.includes('Line'));
      errors = lines.map((line, index) => ({
        line: index + 1,
        message: line,
        fix: '',
      }));
    }

    res.json({ errors });
  } catch (error: any) {
    console.error('Debug error:', error);
    res.status(500).json({ error: 'Failed to analyze code' });
  }
});

// Code explanation endpoint (already exists, enhanced)
router.post('/api/explain', async (req, res) => {
  try {
    const { code, language } = req.body;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert programmer. Explain code clearly in Arabic, covering what it does, how it works, and any important details.',
        },
        {
          role: 'user',
          content: `Explain this ${language} code in Arabic:\n\n${code}`,
        },
      ],
      max_tokens: 1500,
      temperature: 0.5,
    });

    const explanation = completion.choices[0].message.content || 'لم يتم الحصول على شرح';

    res.json({ explanation });
  } catch (error: any) {
    console.error('Explain error:', error);
    res.status(500).json({ error: 'Failed to explain code' });
  }
});

// Code generation endpoint (enhanced)
router.post('/api/generate', async (req, res) => {
  try {
    const { prompt, language } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ 
        error: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env file.' 
      });
    }

    if (!prompt || !language) {
      return res.status(400).json({ error: 'Missing required fields: prompt and language' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert ${language} programmer. Generate clean, well-commented, production-ready code based on user requirements. Return only the code without markdown formatting.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    let code = completion.choices[0].message.content || '';
    
    // Remove markdown code blocks if present
    code = code.replace(/```[\w]*\n/g, '').replace(/```$/g, '').trim();

    res.json({ code });
  } catch (error: any) {
    console.error('Generate error:', error);
    const errorMessage = error.message || 'Failed to generate code';
    res.status(500).json({ error: errorMessage });
  }
});

// Run code endpoint (basic execution simulation)
router.post('/api/run', async (req, res) => {
  try {
    const { code, language } = req.body;

    // For security, we'll simulate execution with AI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a code execution simulator. Analyze the ${language} code and predict its output. If there are errors, describe them. Return only the expected output or error message.`,
        },
        {
          role: 'user',
          content: `What would be the output of this ${language} code:\n\n${code}`,
        },
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    const output = completion.choices[0].message.content || 'No output';

    res.json({ output });
  } catch (error: any) {
    console.error('Run error:', error);
    res.status(500).json({ error: 'Failed to execute code' });
  }
});

// Generate scenario endpoint
router.post('/api/generate-scenario', async (req, res) => {
  try {
    const { scenarioId, title, description, language } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ 
        error: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env file.' 
      });
    }

    if (!title || !description || !language) {
      return res.status(400).json({ error: 'Missing required fields: title, description, and language' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert software architect. Generate a complete project structure with multiple files based on the scenario. Return a JSON object with format: {"files": [{"name": "filename", "path": "path/to/file", "content": "file content"}]}`,
        },
        {
          role: 'user',
          content: `Create a complete ${language} project for: ${title}\n\nDescription: ${description}\n\nGenerate all necessary files with complete, production-ready code.`,
        },
      ],
      max_tokens: 3000,
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '{"files": []}';
    let result;
    
    try {
      result = JSON.parse(content);
    } catch {
      // Fallback: create a single file
      result = {
        files: [
          {
            name: 'main.' + (language === 'python' ? 'py' : 'js'),
            path: 'main.' + (language === 'python' ? 'py' : 'js'),
            content: content,
          },
        ],
      };
    }

    res.json(result);
  } catch (error: any) {
    console.error('Generate scenario error:', error);
    const errorMessage = error.message || 'Failed to generate scenario';
    res.status(500).json({ error: errorMessage });
  }
});

// Summarize project endpoint
router.post('/api/summarize-project', async (req, res) => {
  try {
    const { files } = req.body;

    // Prepare files content
    const filesContent = files
      .map((file: any) => `File: ${file.path}\n\`\`\`${file.extension}\n${file.content}\n\`\`\``)
      .join('\n\n');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert code analyst. Analyze the project files and provide a comprehensive summary in Arabic covering: project purpose, architecture, main components, file relationships, technologies used, and key features.',
        },
        {
          role: 'user',
          content: `Analyze this project and provide a detailed summary in Arabic:\n\n${filesContent}`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.5,
    });

    const summary = completion.choices[0].message.content || 'لم يتم الحصول على ملخص';

    res.json({ summary });
  } catch (error: any) {
    console.error('Summarize error:', error);
    res.status(500).json({ error: 'Failed to summarize project' });
  }
});

// Vodafone Cash payment endpoint (mock implementation)
router.post('/api/payment/vodafone-cash', async (req, res) => {
  try {
    const { phoneNumber, amount, userId } = req.body;

    // In production, integrate with actual Vodafone Cash API
    // This is a mock implementation
    console.log(`Payment request: ${phoneNumber}, ${amount} EGP for user ${userId}`);

    // Simulate payment processing
    const success = Math.random() > 0.1; // 90% success rate for demo

    if (success) {
      // In production, update user's plan in Firestore here
      res.json({
        success: true,
        message: 'Payment request sent successfully',
        transactionId: `VFC-${Date.now()}`,
      });
    } else {
      res.json({
        success: false,
        message: 'Payment failed. Please try again.',
      });
    }
  } catch (error: any) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

export default router;
