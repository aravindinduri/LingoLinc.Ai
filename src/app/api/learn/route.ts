import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

export async function POST(req: NextRequest) {
  console.log('hj')
  const { language, day } = await req.json();
  if (!language || !day) {
    return NextResponse.json({ error: 'Language and day are required' }, { status: 400 });
  }

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: 'user',
        parts: [
          { text: `Please give me 5 words and 5 sentences in ${language} for Day ${day}` },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(`Please provide the words and sentences.`);
  const responseText = result.response.text();

  const matches = responseText.match(/(\*\*Words:\*\*([\s\S]*?)\*\*Sentences:\*\*([\s\S]*))/);
  if (!matches) {
    return NextResponse.json({ error: 'No lessons available' }, { status: 200 });
  }

  const words = matches[2].trim().split('\n').map(item => item.replace(/^\d+\.\s*/, '').trim());
  const sentences = matches[3].trim().split('\n').map(item => item.replace(/^\d+\.\s*/, '').trim());

  const responseData = {
    language,
    day,
    words,
    sentences,
  };
  return NextResponse.json(responseData);
}
