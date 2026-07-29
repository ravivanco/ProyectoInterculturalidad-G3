// PG3-345 — Análisis de imagen con Gemini Vision (API-S4, Bryan Gualpa)
import { Router, Response } from 'express';
import { authGuard, AuthenticatedRequest } from '../middleware/authGuard';
import { roleGuard } from '../middleware/roleGuard';

const router = Router();

type GeminiEstimate = {
  description: string;
  estimatedCalories: number;
  confidence: 'mock' | 'gemini';
};

const mockEstimate = (hint?: string): GeminiEstimate => ({
  description: hint?.trim() || 'Alimento no identificado (modo demo)',
  estimatedCalories: 280,
  confidence: 'mock',
});

async function analyzeWithGemini(imageBase64: string, mimeType: string): Promise<GeminiEstimate> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return mockEstimate('Configure GEMINI_API_KEY para análisis real');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const body = {
    contents: [
      {
        parts: [
          {
            text: 'Estima calorías aproximadas del alimento en la imagen. Responde JSON: {"description":"...","estimatedCalories":number}',
          },
          { inline_data: { mime_type: mimeType, data: imageBase64 } },
        ],
      },
    ],
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    return mockEstimate(`Gemini HTTP ${resp.status}`);
  }

  const json = (await resp.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  try {
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim()) as {
      description?: string;
      estimatedCalories?: number;
    };
    return {
      description: parsed.description ?? 'Alimento detectado',
      estimatedCalories: Number(parsed.estimatedCalories) || 250,
      confidence: 'gemini',
    };
  } catch {
    return { description: text.slice(0, 200) || 'Análisis Gemini', estimatedCalories: 250, confidence: 'gemini' };
  }
}

/**
 * @openapi
 * /vision/food-image:
 *   post:
 *     summary: Estimar alimento y calorías desde imagen (PG3-345)
 *     tags: [Vision S4]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageBase64:
 *                 type: string
 *               mimeType:
 *                 type: string
 *                 default: image/jpeg
 */
router.post(
  '/food-image',
  authGuard,
  roleGuard(['paciente', 'nutricionista']),
  async (req: AuthenticatedRequest, res: Response) => {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ success: false, message: 'imageBase64 is required.' });
    }

    const estimate = await analyzeWithGemini(imageBase64, mimeType);
    return res.json({ success: true, data: estimate });
  }
);

export default router;
