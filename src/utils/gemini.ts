const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
export default async function run() {
   const prompt = "Write a story about a AI and magic"
   
   const result = await model.generateContent(prompt);
   const response = await result.response;
   const text = response.text();
    console.log(text);
  }
  
// run();