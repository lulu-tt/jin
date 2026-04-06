import { GoogleGenAI } from "@google/genai";

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  groundingMetadata?: any;
}

// API 키 가져오기 (환경 변수 또는 로컬 스토리지)
const getApiKey = () => {
  // 1. Vite 환경 변수 (빌드 시 치환됨)
  const viteKey = import.meta.env?.VITE_GEMINI_API_KEY;
  if (viteKey && viteKey !== "MY_GEMINI_API_KEY" && viteKey !== "") return viteKey as string;

  // 2. process.env (Node 환경 또는 Vite define)
  try {
    const processKey = process.env.GEMINI_API_KEY;
    if (processKey && processKey !== "MY_GEMINI_API_KEY" && processKey !== "") return processKey as string;
  } catch (e) {
    // process 객체가 정의되지 않은 환경 (브라우저 배포판)
  }

  // 3. 로컬 스토리지 (사용자 직접 입력)
  return localStorage.getItem('GEMINI_API_KEY') || "";
};

/**
 * Gemini API를 통해 메시지를 전송하고 응답을 받습니다.
 */
export async function sendMessage(
  message: string,
  history: ChatMessage[] = []
): Promise<{ text: string; groundingMetadata?: any }> {
  const apiKey = getApiKey();
  
  if (!apiKey || apiKey.includes("여기에") || apiKey === "MY_GEMINI_API_KEY") {
    console.error("[Gemini Service] API Key is missing or invalid.");
    throw new Error("API_KEY_MISSING");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // 대화 이력 구성 (첫 메시지가 모델인 경우 생략하여 SDK 오류 방지)
    const contents = history
      .filter((msg, index) => !(index === 0 && msg.role === "model"))
      .map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      }));

    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    // 요청하신 gemini-2.5-flash 모델 사용
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
