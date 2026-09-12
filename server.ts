import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialization of Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// AI: Prompt -> Document Generation
app.post("/api/ai/generate-document", async (req: Request, res: Response) => {
  try {
    const { prompt, documentType, tone, length } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key is not configured. Please check Settings > Secrets.",
      });
    }

    const systemInstruction = `You are the core AI Document Engine for Tex2PDF, an all-in-one document creation platform.
Generate a structured, professional document based on the user's prompt.
The document should use clean Markdown formatting:
- # for Document Title
- ## for major sections
- ### for subsections
- Bold **text** for emphasis
- Tables with standard markdown | col1 | col2 |
- Bulleted lists or numbered lists
- Include realistic, high-quality, comprehensive content (not placeholders like '[insert here]', write complete, realistic text).
- Tailor the tone (${tone || "professional"}) and document type (${documentType || "general document"}).
Return ONLY the formatted document text in clean Markdown.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Generate a complete, ready-to-export document for: "${prompt}". Approximate length target: ${length || "medium"}.`,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const generatedText = response.text || "";
    res.json({ content: generatedText });
  } catch (error: any) {
    console.error("AI Generation error:", error);
    res.status(500).json({
      error: error.message || "Failed to generate document content",
    });
  }
});

// AI: Transform text (Rewrite, Simplify, Grammar, Summarize, Expand, Tone shift)
app.post("/api/ai/transform", async (req: Request, res: Response) => {
  try {
    const { text, action, instruction, targetLanguage } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key is not configured. Please check Settings > Secrets.",
      });
    }

    let actionPrompt = "";
    switch (action) {
      case "rewrite-professional":
        actionPrompt = "Rewrite the following text to sound highly professional, authoritative, and polished.";
        break;
      case "simplify":
        actionPrompt = "Simplify this text so that it is concise, crystal clear, and easy to read for any audience.";
        break;
      case "fix-grammar":
        actionPrompt = "Fix all grammar, spelling, punctuation, and typographical mistakes while preserving the original meaning.";
        break;
      case "summarize":
        actionPrompt = "Summarize this text into an executive summary followed by key bullet points.";
        break;
      case "expand":
        actionPrompt = "Elaborate and expand upon the points in this text, providing more depth, examples, and professional context.";
        break;
      case "translate":
        actionPrompt = `Translate the following text accurately and naturally into ${targetLanguage || "French"}. Retain formatting.`;
        break;
      case "extract-table":
        actionPrompt = "Extract any data, metrics, or structured information from this text into a clean Markdown table.";
        break;
      case "custom":
        actionPrompt = instruction || "Improve this document section.";
        break;
      default:
        actionPrompt = "Improve the quality, flow, and formatting of this text.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `${actionPrompt}\n\nOriginal Text:\n"""\n${text}\n"""`,
      config: {
        systemInstruction: "You are an expert document editor. Respond directly with the transformed text, maintaining appropriate markdown formatting if present.",
        temperature: 0.4,
      },
    });

    res.json({ result: response.text || "" });
  } catch (error: any) {
    console.error("AI Transform error:", error);
    res.status(500).json({
      error: error.message || "Failed to transform text",
    });
  }
});

// AI: Document Chat & Analysis (Q&A about the document)
app.post("/api/ai/chat", async (req: Request, res: Response) => {
  try {
    const { documentContent, userQuestion } = req.body;
    if (!userQuestion) {
      return res.status(400).json({ error: "User question is required" });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key is not configured.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `User Question: ${userQuestion}\n\nDocument Context:\n"""\n${(documentContent || "").slice(0, 15000)}\n"""`,
      config: {
        systemInstruction: "You are the Tex2PDF Document Intelligence Assistant. Answer the user's questions about the document clearly, accurately, and cite specific sections or data when applicable.",
        temperature: 0.3,
      },
    });

    res.json({ answer: response.text || "" });
  } catch (error: any) {
    console.error("AI Chat error:", error);
    res.status(500).json({
      error: error.message || "Failed to analyze document",
    });
  }
});

// Setup Vite middleware for development or static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Tex2PDF Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
