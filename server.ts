import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON parsing with a limit for base64 image uploads
app.use(express.json({ limit: "20mb" }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Endpoint to generate or edit live background images
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt, model, originalImage, editPrompt } = req.body;

    if (!prompt && !editPrompt) {
      return res.status(400).json({ error: "Prompt or edit prompt is required." });
    }

    const selectedModel = model || "gemini-2.5-flash-image";
    
    // Core prompt enhancer to enforce the user's visual quality guidelines:
    // "semi-realistic 3D unreal engine rendering quality, smooth, colorful, premium,
    // not dramatic, not too dark, not too HDR, comfortable to look at, not flat, copyright-free"
    const styleEnhancer = `, semi-realistic 3D unreal engine rendering quality, smooth clean studio setting, soft colorful lighting, premium commercial look, pleasant pastel or clean color palette, comfortable to eye for long-time viewing, not flat, avoid any branded logos, completely copyright-free custom elements, high detail vertical format, perfect live shopping background.`;

    let response;

    if (originalImage && editPrompt) {
      // IMAGE EDITING / REFINEMENT
      let base64Data = originalImage;
      let mimeType = "image/png";
      
      if (originalImage.startsWith("data:")) {
        const commaIdx = originalImage.indexOf(",");
        if (commaIdx !== -1) {
          base64Data = originalImage.substring(commaIdx + 1);
          mimeType = originalImage.substring(5, originalImage.indexOf(";"));
        }
      }

      const finalPrompt = `${editPrompt}${styleEnhancer}`;

      response = await ai.models.generateContent({
        model: selectedModel,
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: finalPrompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "9:16",
          },
        },
      });
    } else {
      // NEW IMAGE GENERATION
      const finalPrompt = `${prompt}${styleEnhancer}`;

      response = await ai.models.generateContent({
        model: selectedModel,
        contents: {
          parts: [
            {
              text: finalPrompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "9:16",
          },
        },
      });
    }

    // Extract base64 image from the response parts
    let base64Image = "";
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          break;
        }
      }
    }

    if (!base64Image) {
      // Fallback if model returned text description instead of image
      console.warn("No inlineData found in response candidate parts:", JSON.stringify(response));
      return res.status(500).json({ 
        error: "Image generation completed but no image binary was returned. Please try again with a more descriptive prompt.",
        rawText: response.text 
      });
    }

    res.json({
      imageUrl: `data:image/png;base64,${base64Image}`,
      modelUsed: selectedModel,
    });

  } catch (error: any) {
    console.error("Gemini Image generation error:", error);
    res.status(500).json({ 
      error: error.message || "Failed to generate image via Gemini API.",
      details: error.toString()
    });
  }
});

// Serve health status
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", apiConfigured: !!process.env.GEMINI_API_KEY });
});

// Vite Integration Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
