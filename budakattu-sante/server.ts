/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables in development
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini AI safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY is not defined in environment variables. GenAI Advisor queries will default to fallback responses.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

const ai = getGeminiClient();

// API endpoint for GenAI Advisor
app.post('/api/adviser', async (req, res) => {
  const { observations, productOfInterest, mspPrice, unit } = req.body;

  if (!observations) {
    return res.status(400).json({ error: 'Observations are required to receive advice.' });
  }

  if (!ai) {
    // Elegant fallback guidance when API key is missing, maintaining professional, immersive feedback
    const mockAdvice = `### 🌿 Budakattu-Sante Local Advisory (Local Rule Engine)
Since the live **Canopy AI Node** (Gemini) is currently initializing or waiting for a credentials key, here is our cooperative guidelines for **${productOfInterest || 'Forest Products'}**:

1. **Harvest Yield Model**: Based on local community calendars, pre-monsoon precipitation boosts general nectar secretion. Estimated yield is **Steadily Strong**.
2. **Pricing Council**: The official MSP is **₹${mspPrice || 'N/A'} per ${unit || 'unit' }**. We advise pricing at **₹${Math.round((mspPrice || 300) * 1.15)}** (15% above floor) for urban home pre-orders to account for transportation costs.
3. **Tribal Audio Narrative Draft**: 
   *"Welcome, dear buyer. This pure reserve bounty is sustainably gathered from remote hills by custom lineage elders. The MSP floor ensures our community is protected while providing you unmatched raw quality."*

*To activate dynamic real-time astronomical and climatic GenAI analysis, please supply your **GEMINI_API_KEY** in AI Studio secrets.*`;
    return res.json({ advice: mockAdvice });
  }

  try {
    const prompt = `You are "Budakattu-Sante Sahayaka", an AI cooperative agronomy & fair trade counselor for forest-dwelling tribal cooperatives (e.g., Soligas, Jenu Kurubas) in the South Indian Western Ghat ranges.
The cooperative leader or family representative has submitted the following active forest observation:
- Product of Interest: "${productOfInterest || 'General Forest Produce'}" (Official Government MSP: ₹${mspPrice || 100} per ${unit || 'unit'})
- Local Forest Situation/Climate Observations: "${observations}"

Please output a comprehensive, beautiful markdown guide to assist them on:
1. **Harvest Forecast & Resource Extraction Guide**: Assess if the observations imply high, medium, or low yield. Give 2-3 ecological insights in simple words.
2. **Fair Trade Cooperative Pricing Counsel**: Recommend a perfect fair Listing Price (normally 10% to 25% above MSP to fund tribal cooperative logistics and direct payment buffers) and justify it easily.
3. **Tribal Localization Audio Snippet**: Provide a simple 2-3 sentence warm audio narration concept that we can read to semi-literate weavers/gatherers or play for urban buyers. Keep it deeply rooted in tribal empowerment, soil health, and gratitude to nature.

Make your output beautiful, concise (under 250 words), clean, extremely respectful, and structured with clear subsections. Do not mention API keys or technical telemetry. Use warm, custom forest emojis.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    const adviceText = response.text || "Could not retrieve advisory report. Please try again.";
    return res.json({ advice: adviceText });
  } catch (error: any) {
    console.error("Gemini API Error in /api/adviser:", error);
    return res.status(500).json({ 
      error: "Our AI counselor is taking a rest under the canopy. Falling back to local advisories.",
      details: error.message 
    });
  }
});

// Configure Vite entry point and middlewares
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production build files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Budakattu-Sante Server online at http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
};

startServer().catch(err => {
  console.error("Failing to start server:", err);
});
