import { GoogleGenAI, Type } from "@google/genai";
import type { PredictionResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const predictMines = async (
  serverSeed: string,
  clientSeed: string,
  nonce: string,
  mines: number
): Promise<PredictionResult[]> => {

  const prompt = `
    You are a provably fair gaming algorithm analyst for a casino game called 'Mines'.
    Your task is to simulate the outcome of a 'Mines' game based on cryptographic seeds.
    The game is played on a 5x5 grid (25 cells total).
    
    Given the following inputs:
    - Server Seed: ${serverSeed}
    - Client Seed: ${clientSeed}
    - Nonce: ${nonce}
    - Number of Mines: ${mines}

    Generate the locations of the ${mines} mines on the 5x5 grid.
    The grid coordinates range from 0 to 4 for both x (horizontal) and y (vertical).
    Your output MUST be a JSON array containing exactly 25 objects, one for each cell of the grid.
    Each object must have three properties: 'x' (number), 'y' (number), and 'isMine' (boolean).
    There must be exactly ${mines} objects where 'isMine' is true, and ${25 - mines} objects where 'isMine' is false.
    Do not include any other text, explanations, or markdown formatting in your response.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              x: { type: Type.INTEGER, description: "The x-coordinate of the cell (0-4)." },
              y: { type: Type.INTEGER, description: "The y-coordinate of the cell (0-4)." },
              isMine: { type: Type.BOOLEAN, description: "True if the cell contains a mine, false otherwise." },
            },
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const prediction = JSON.parse(jsonText) as PredictionResult[];

    if (!Array.isArray(prediction) || prediction.length !== 25) {
      throw new Error("AI response was not a valid 25-cell grid.");
    }
    
    const mineCount = prediction.filter(p => p.isMine).length;
    if (mineCount !== mines) {
        console.warn(`AI generated ${mineCount} mines, but ${mines} were requested. The model may have hallucinated. Proceeding with the generated result.`);
    }

    return prediction;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
};