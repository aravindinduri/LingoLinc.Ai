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
  if (!language || !day) {
    return NextResponse.json({ error: 'Language and day are required' }, { status: 400 });
  }

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: 'user',
        parts: [
          { text: 'Please provide 5 words and 5 sentences for the following language and day.' },
        ],
      },
      {
        role: 'model',
        parts: [
          { text: "Sure! Please provide the language and day, and I will give you the required words and sentences." },
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

  const result = await chatSession.sendMessage("Provide 5 words and 5 sentences.");
  const responseText = result.response.text();

  // Extract words and sentences from the response
  const words: string[] = [];
  const sentences: string[] = [];
  let isSentenceSection = false;
  responseText.split('\n').forEach(line => {
    if (line.startsWith('**Words:**')) {
      isSentenceSection = false;
    } else if (line.startsWith('**Sentences:**')) {
      isSentenceSection = true;
    } else if (line.startsWith('1. ') && !isSentenceSection) {
      words.push(line.substring(3));
    } else if (isSentenceSection && line.startsWith('1. ')) {
      sentences.push(line.substring(3));
    }
  });

  return NextResponse.json({ words, sentences });
}
