import { GoogleGenAI } from "@google/genai";

export interface FoodAnalysis {
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const removeCodeBlock = (text: string): string =>
  text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

const validateNumber = (
  value: unknown,
  fieldName: string
): number => {
  const parsedValue = Number(value);

  if (
    !Number.isFinite(parsedValue) ||
    parsedValue < 0
  ) {
    throw new Error(
      `Gemini devolvió un valor inválido para ${fieldName}`
    );
  }

  return parsedValue;
};

export const analyzeFoodImage = async (
  imageBuffer: Buffer,
  mimeType: string
): Promise<FoodAnalysis> => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "La variable GEMINI_API_KEY no está configurada"
    );
  }

  const ai = new GoogleGenAI({
    apiKey,
  });

  const base64Image =
    imageBuffer.toString("base64");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        inlineData: {
          mimeType,
          data: base64Image,
        },
      },
      {
        text: `
Analiza visualmente esta imagen de comida.

Devuelve únicamente un objeto JSON válido con esta estructura:

{
  "description": "Descripción breve del alimento",
  "calories": 0,
  "protein": 0,
  "carbs": 0,
  "fat": 0
}

Condiciones:
- calories debe expresarse en kilocalorías.
- protein, carbs y fat deben expresarse en gramos.
- Todos los valores numéricos deben ser mayores o iguales a cero.
- No agregues Markdown ni texto fuera del JSON.
- Los resultados son estimaciones visuales.
        `.trim(),
      },
    ],
  });

  const responseText = response.text;

  if (!responseText) {
    throw new Error(
      "Gemini no devolvió un resultado"
    );
  }

  let parsedResponse: Record<string, unknown>;

  try {
    parsedResponse = JSON.parse(
      removeCodeBlock(responseText)
    ) as Record<string, unknown>;
  } catch {
    throw new Error(
      "Gemini devolvió una respuesta que no es JSON válido"
    );
  }

  const description = String(
    parsedResponse.description ?? ""
  ).trim();

  if (!description) {
    throw new Error(
      "Gemini no devolvió una descripción válida"
    );
  }

  return {
    description,
    calories: validateNumber(
      parsedResponse.calories,
      "calories"
    ),
    protein: validateNumber(
      parsedResponse.protein,
      "protein"
    ),
    carbs: validateNumber(
      parsedResponse.carbs,
      "carbs"
    ),
    fat: validateNumber(
      parsedResponse.fat,
      "fat"
    ),
  };
};