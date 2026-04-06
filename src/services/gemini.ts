import { GoogleGenAI } from "@google/genai";

// 환경 변수 처리 (Vite의 import.meta.env와 process.env 모두 대응)
// @ts-ignore - 환경에 따라 다르게 정의될 수 있습니다.
const apiKey = (import.meta.env?.VITE_GEMINI_API_KEY as string) || (process.env?.GEMINI_API_KEY as string);

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  groundingMetadata?: any;
}

/**
 * Gemini API를 통해 메시지를 전송하고 응답을 받습니다.
 */
export async function sendMessage(
  message: string,
  history: ChatMessage[] = []
): Promise<{ text: string; groundingMetadata?: any }> {
  // 1. API 키 확인
  if (!apiKey || apiKey.includes("여기에") || apiKey === "MY_GEMINI_API_KEY") {
    console.error("[Gemini Service] API Key is missing or invalid.");
    throw new Error("API_KEY_MISSING");
  }

  try {
    // SDK 사양: 객체 형태로 API 키 전달
    const ai = new GoogleGenAI({ apiKey });
    
    // 대화 이력 및 현재 메시지 구성
    const contents = history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    // 원래 소스의 기본 설정 모델인 gemini-3.1-pro-preview 사용
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: `당신은 대한민국 외교부(MOFA)의 공식 AI 비서 '디플리'입니다.
남극과 북극 등 전 세계 어디서든 우리 국민의 안전을 책임지는 외교부의 상징적인 존재입니다.

[답변 원칙]
1. 정체성: 자신을 '외교부 AI 비서 디플리'로 소개하며, 항상 친절하고 신뢰감 있는 태도를 유지하세요.
2. 정보원: 외교부 홈페이지(mofa.go.kr) 및 해외안전여행(0404.go.kr) 정보를 최우선으로 합니다.
3. 정확성: 여권 규정, 비자, 영사 서비스, 국가별 여행 경보 등 공신력 있는 정보를 정확히 전달하세요.
4. 구성: 리스트나 마크다운 형식을 적절히 사용하여 가독성 있게 답변하세요.
5. 위기 대응: 사건/사고 등 긴급 상황 시에는 즉시 영사콜센터(+82-2-3210-0404) 연락을 안내하세요.`,
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text || "죄송합니다. 답변을 생성하는 중에 오류가 발생했습니다.",
      groundingMetadata: (response as any).candidates?.[0]?.groundingMetadata,
    };
  } catch (error: any) {
    console.error("[Gemini Service] Detailed Error:", error);
    
    const errorMsg = error.message || "";
    
    // 특정 에러 상황에 따른 메시지 처리
    if (errorMsg.includes("403") || errorMsg.includes("API key")) {
      throw new Error("API_KEY_INVALID");
    }
    
    if (errorMsg.includes("429") || errorMsg.includes("Quota") || errorMsg.includes("exhausted")) {
      throw new Error("API_QUOTA_EXCEEDED");
    }

    if (errorMsg.includes("404") || errorMsg.includes("not found")) {
      throw new Error("MODEL_NOT_FOUND");
    }
    
    throw new Error("API_COMMUNICATION_ERROR");
  }
}
