
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai"

const apiKey  = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run() {
  const chatSession = model.startChat({
    generationConfig,
    // safetySettings: Adjust safety settings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
      {
        role: "user",
        parts: [
          { text: "i'm devlopeing a language learning web app you need give me 5 word and sentences from the language" },
        ],
      },
      {
        role: "model",
        parts: [
          { text: "Please tell me what language you're working on! I need to know the target language to give you relevant words and sentences. \n\nFor example, tell me:\n\n* **\"I'm developing a Spanish learning app.\"** \n* **\"I'm building a French language website.\"** \n* **\"I'm working on a Korean learning app.\"**\n\nOnce I know the language, I can give you 5 words and sentences that are useful for learners. 😊 \n" },
        ],
      },
      {
        role: "user",
        parts: [
          { text: "iam going to give you a language and day you need to give me the 5 words and 5 sentences from the input language" },
        ],
      },
      {
        role: "model",
        parts: [
          { text: "Sounds great! I'm ready.  Tell me the language and day, and I'll give you 5 words and 5 sentences. 😊 \n" },
        ],
      },
      {
        role: "user",
        parts: [
          { text: "lets go : German Day 1" },
        ],
      },
      {
        role: "model",
        parts: [
          { text: "Okay, here are 5 words and 5 sentences in German for Day 1:\n\n**Words:**\n\n1. **Hallo** (Hello)\n2. **Danke** (Thank you)\n3. **Bitte** (Please)\n4. **Ja** (Yes)\n5. **Nein** (No)\n\n**Sentences:**\n\n1. **Hallo, wie geht es Ihnen?** (Hello, how are you?)\n2. **Danke, gut. Und Ihnen?** (Thank you, good. And you?)\n3. **Ich heiße [your name].** (My name is [your name].)\n4. **Bitte schön.** (You're welcome.)\n5. **Wie bitte?** (Excuse me? / Can you repeat that?) \n" },
        ],
      },
      {
        role: "user",
        parts: [
          { text: "Gernam Day 10" },
        ],
      },
      {
        role: "model",
        parts: [
          { text: "Okay, here are 5 words and 5 sentences in German for Day 10, focusing on everyday activities:\n\n**Words:**\n\n1. **Essen** (to eat)\n2. **Trinken** (to drink)\n3. **Lesen** (to read)\n4. **Schreiben** (to write)\n5. **Arbeiten** (to work)\n\n**Sentences:**\n\n1. **Ich esse gerne Pizza.** (I like to eat pizza.)\n2. **Was trinkst du am liebsten?** (What do you like to drink best?)\n3. **Ich lese gerade ein Buch.** (I am currently reading a book.)\n4. **Kannst du mir bitte helfen, diesen Brief zu schreiben?** (Can you please help me write this letter?)\n5. **Wo arbeitest du?** (Where do you work?) \n" },
        ],
      },
      {
        role: "user",
        parts: [
          { text: "French Day 10" },
        ],
      },
      {
        role: "model",
        parts: [
          { text: "Here are 5 words and 5 sentences in French for Day 10, focusing on daily routines:\n\n**Words:**\n\n1. **Manger** (to eat)\n2. **Boire** (to drink)\n3. **Lire** (to read)\n4. **Écrire** (to write)\n5. **Travailler** (to work)\n\n**Sentences:**\n\n1. **J'aime manger des crêpes.** (I like to eat crêpes.)\n2. **Qu'est-ce que tu préfères boire ?** (What do you prefer to drink?)\n3. **Je lis un roman en ce moment.** (I'm reading a novel right now.)\n4. **Peux-tu m'aider à écrire cette lettre ?** (Can you help me write this letter?)\n5. **Où travailles-tu ?** (Where do you work?) \n" },
        ],
      },
      {
        role: "user",
        parts: [
          { text: "give me output in json format" },
        ],
      },
      {
        role: "model",
        parts: [
          { text: "```json\n{\n  \"language\": \"French\",\n  \"day\": 10,\n  \"words\": [\n    \"Manger\",\n    \"Boire\",\n    \"Lire\",\n    \"Écrire\",\n    \"Travailler\"\n  ],\n  \"sentences\": [\n    \"J'aime manger des crêpes.\",\n    \"Qu'est-ce que tu préfères boire ?\",\n    \"Je lis un roman en ce moment.\",\n    \"Peux-tu m'aider à écrire cette lettre ?\",\n    \"Où travailles-tu ?\"\n  ]\n}\n``` \n" },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  console.log(result.response.text());
}

run();