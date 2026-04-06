import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  groundingMetadata?: any;
}

export async function sendMessage(
  message: string,
  history: ChatMessage[] = []
): Promise<{ text: string; groundingMetadata?: any }> {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Convert history to Gemini format
  const contents = history.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.text }],
  }));

  // Add current message
  contents.push({
    role: "user",
    parts: [{ text: message }],
  });

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents,
    config: {
      systemInstruction: `당신은 대한민국 외교부(MOFA)의 공식 AI 비서입니다.
사용자의 질문에 대해 외교부 홈페이지(mofa.go.kr)의 정보를 최우선으로 검색하여 답변하세요.

[답변 원칙]
1. 정확성: 외교부 공식 공지, 여권 규정, 영사 서비스 절차를 정확히 안내하세요.
2. 출처 표기: 답변의 근거가 된 외교부 게시물 링크가 있다면 반드시 언급하세요.
3. 친절함: 공공기관 비서로서 정중하고 신뢰감 있는 말투를 사용하세요.
4. 다국어: 외국어 질문에는 해당 언어로 답변하되, 한국어 정보를 기반으로 하세요.
5. 시각화 제안: 여권 준비물 등 리스트가 필요한 경우 마크다운 형식을 활용해 가독성을 높이세요.

[특화 기능 안내]
- 여권 가이드: 아이 여권, 분실 시 대처 등 상황별 절차 안내.
- 안전 브리핑: 특정 국가 여행 시 주의사항 요약.
- 영사 조력: 해외 위급 상황 시 연락처 및 대처법.`,
      tools: [{ googleSearch: {} }],
    },
  });

  return {
    text: response.text || "죄송합니다. 답변을 생성하는 중에 오류가 발생했습니다.",
    groundingMetadata: response.candidates?.[0]?.groundingMetadata,
  };
}
