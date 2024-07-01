// app/api/generate/route.ts

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
  const { language, day } = await req.json();
  console.log('sdc')
  if (!language || !day) {
    return NextResponse.json({ error: 'Language and day are required' }, { status: 400 });
  }

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: 'user',
        parts: [
          { text: 'I am going to give you a language and day, you need to give me the 5 words and 5 sentences from the input language' },
        ],
      },
      {
        role: 'model',
        parts: [
          { text: "Sounds great! I'm ready. Tell me the language and day, and I'll give you 5 words and 5 sentences. 😊" },
        ],
      },
      {
        role: 'user',
        parts: [
          { text: `${language} Day ${day}` },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("Please provide the words and sentences.");
  const responseText = result.response.text();

  return NextResponse.json({ output: responseText });
}
