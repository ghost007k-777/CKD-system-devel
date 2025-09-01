import { GoogleGenAI, Type } from "@google/genai";

// Assume process.env.API_KEY is available
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export interface ImageAnalysisResult {
  workType: string;
  hazards: string[];
}

const fileToGenerativePart = (file: File) => {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result !== 'string') {
        return reject(new Error("Failed to read file"));
      }
      const base64 = e.target.result.split(',')[1];
      resolve({
        inlineData: {
          data: base64,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};


export const analyzeImageForRisks = async (imageFile: File): Promise<ImageAnalysisResult> => {
  if (!API_KEY) {
    throw new Error("Gemini API 키가 설정되지 않았습니다.");
  }
  
  const imagePart = await fileToGenerativePart(imageFile);

  const textPart = {
    text: `이 작업 현장 이미지를 분석해주세요. 수행 중인 주요 작업 유형을 식별하고 잠재적인 위험 요소를 나열해주세요. 지정된 JSON 형식으로 결과를 제공해주세요. 이미지가 작업 현장이 아닐 경우, workType에 해당 사실을 명시하고 hazards는 비워두세요.`
  };
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            workType: {
              type: Type.STRING,
              description: "The primary type of work identified in the image."
            },
            hazards: {
              type: Type.ARRAY,
              description: "A list of potential hazards or risks observed.",
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const jsonString = response.text;
    const result = JSON.parse(jsonString);
    return result as ImageAnalysisResult;
  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    throw new Error("이미지 분석에 실패했습니다. 다시 시도해주세요.");
  }
};