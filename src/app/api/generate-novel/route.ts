import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { title, genre, prompt, themes } = await req.json();

    const systemPrompt = `
      제목: ${title}
      장르: ${genre}
      테마: ${themes.join(', ')}
      추가 프롬프트: ${prompt}
      
      위 정보를 바탕으로 20000자 분량의 한국어 단편소설을 써주세요.
      작품의 특징:
      1. 제목과 장르, 테마에 어울리는 스토리라인
      2. 기승전결이 있는 구조
      3. 생생한 묘사와 캐릭터 표현
      4. 자연스러운 대화문 (큰따옴표로 처리)
      5. 적절한 단락 구분
      
      ${prompt ? "추가 요구사항: " + prompt : ""}
    `;

    const response = await openai.chat.completions.create({
      model: "o1-preview",
      messages: [{ role: "user", content: systemPrompt }],
      temperature: 1,
      max_completion_tokens: 32768,
    });

    return NextResponse.json({
      content: response.choices[0].message.content,
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "소설 생성에 실패했습니다" },
      { status: 500 }
    );
  }
} 