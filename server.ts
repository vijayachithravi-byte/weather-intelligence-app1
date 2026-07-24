import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI Weather Intelligence Summary using Gemini 3.6 Flash
  app.post('/api/ai-recommendations', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY environment variable is missing',
          fallback: true
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const { weatherData, locationName, unit } = req.body;

      if (!weatherData) {
        return res.status(400).json({ error: 'weatherData is required' });
      }

      const prompt = `You are an expert Weather Intelligence AI Assistant. Analyze the following weather conditions for ${locationName || 'the requested location'} and generate tailored, actionable recommendations.

Current Weather:
- Temperature: ${weatherData.currentTemp}°${unit.toUpperCase()} (Feels like ${weatherData.feelsLike}°${unit.toUpperCase()})
- Weather Condition: ${weatherData.weatherDescription}
- Humidity: ${weatherData.humidity}%
- Wind Speed: ${weatherData.windSpeed} km/h (${weatherData.windDirectionText || ''})
- Pressure: ${weatherData.pressure} hPa
- UV Index: ${weatherData.uvIndex}
- Visibility: ${weatherData.visibility} km
- Today's Max Temp: ${weatherData.todayMax}°${unit.toUpperCase()}, Min Temp: ${weatherData.todayMin}°${unit.toUpperCase()}
- Max Rain Probability Today: ${weatherData.precipProbabilityMax}%

7-Day Summary:
${weatherData.forecastSummary || 'Normal seasonal variations.'}

Please return a valid JSON object matching the following structure exactly (without markdown backticks or formatting):
{
  "executiveSummary": "A concise 2-sentence summary of today's weather posture.",
  "clothing": ["2 distinct bullet points for clothing/apparel suggestions"],
  "activities": ["2 distinct bullet points for outdoor/indoor activity advice"],
  "travel": ["2 distinct bullet points for commute/driving/flight considerations"],
  "health": ["2 distinct bullet points for UV/humidity/hydration/health precautions"],
  "hydration": "1 specific hydration advice line based on heat/humidity",
  "rainAlert": "1 rain alert or peace-of-mind summary",
  "uvAdvice": "1 UV protection guidance line"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const jsonText = response.text || '';
      const parsedData = JSON.parse(jsonText);

      return res.json({
        success: true,
        data: parsedData,
      });
    } catch (err: any) {
      console.error('Gemini AI API Error:', err);
      return res.status(500).json({
        error: err.message || 'Failed to generate AI recommendations',
        fallback: true,
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Vite middleware for development or static file serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Weather Intelligence server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
