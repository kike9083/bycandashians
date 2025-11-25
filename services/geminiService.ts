import { GoogleGenAI } from "@google/genai";

export const generatePolleraImage = async (prompt: string): Promise<string | null> => {
  let apiKey = '';
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env) {
      // @ts-ignore
      apiKey = process.env.API_KEY || '';
    }
  } catch (e) {
    console.warn("process.env is not available");
  }

  if (!apiKey) {
    console.error("API Key missing");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const enhancedPrompt = `
      High quality, photorealistic image of a Panamanian Pollera traditional dress. 
      Details: ${prompt}. 
      Focus on intricate embroidery, gold jewelry (tembleques), and vibrant colors. 
      Professional fashion photography, soft lighting, cultural heritage style.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: enhancedPrompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};