
import { GoogleGenAI, Type } from "@google/genai";
import { Vehicle } from "../types";

// Note: process.env.API_KEY is injected via Vite's define config
export const getFleetAdvice = async (vehicles: Vehicle[], query: string) => {
  // Always initialize GoogleGenAI inside the function with named parameter
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview', // Correct for complex reasoning tasks
    contents: `
      Dati Flotta Aziendale:
      ${JSON.stringify(vehicles, null, 2)}

      Richiesta Utente: ${query}

      Analizza lo stato dei mezzi e fornisci consigli strategici su manutenzione, scadenze e ottimizzazione operativa. Rispondi in modo professionale.
    `,
    config: {
      // Thinking budget for reasoning tasks
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });

  // response.text is a property, not a method
  return response.text;
};

export const analyzeVehicleImage = async (base64Image: string) => {
  // Always initialize GoogleGenAI inside the function
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image.split(',')[1] || base64Image
    }
  };

  const textPart = {
    text: "Analizza questa foto di un veicolo o di un documento di manutenzione. Estrai marca, modello e targa se visibili. Rispondi RIGOROSAMENTE in formato JSON."
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview', // Flash is efficient for vision-to-text tasks
    contents: { parts: [imagePart, textPart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          brand: { type: Type.STRING },
          model: { type: Type.STRING },
          licensePlate: { type: Type.STRING }
        }
      }
    }
  });

  // Access text property and handle potential undefined
  const jsonStr = response.text || '{}';
  return JSON.parse(jsonStr);
};
