/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
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
            {text: "Hey Gemini \nI am devloping an application an language lerning apllication you need to give me \nstucterd words and sentences to learn the language , i will provide the language and day you need to give me 5 new words and sentences using that words"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Please tell me:\n\n* **What language do you want to learn?**  (e.g., Spanish, French, Japanese, etc.)\n* **What day are you starting?** (e.g., Day 1, Day 2, etc.)\n\nOnce I have that information, I can provide you with 5 new words and sentences using those words, structured for effective language learning. \n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "german day 1"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "## German Day 1: \n\n**New Words:**\n\n1. **Hallo** (ˈhaloː) - Hello\n2. **Danke** (ˈdɑŋkə) - Thank you\n3. **Bitte** (ˈbɪtə) - Please\n4. **Ja** (ˈjaː) - Yes\n5. **Nein** (ˈnaɪn) - No\n\n**Sentences:**\n\n1. **Hallo, wie geht es Ihnen?** (ˈhaloː viː ˈgeːt eːs ˈiːnən) - Hello, how are you?\n2. **Danke, gut.** (ˈdɑŋkə ˈɡuːt) - Thank you, good.\n3. **Bitte schön.** (ˈbɪtə ʃøːn) - You're welcome.\n4. **Ja, ich spreche Deutsch.** (ˈjaː ɪç ˈʃpreːçə ˈdɔɪtʃ) - Yes, I speak German.\n5. **Nein, ich verstehe nicht.** (ˈnaɪn ɪç fɛɐ̯ˈʃteːə ˈnɪçt) - No, I don't understand.\n\n**Tips for Learning:**\n\n* **Pronunciation:** Pay close attention to the pronunciation of each word. German has some unique sounds that might be different from your native language.\n* **Context:** Try to understand the context of each sentence and how the words are used together.\n* **Practice:** Repeat the words and sentences out loud and try to use them in simple conversations. \n* **Use resources:** Look up the words and sentences in a dictionary or online translation tool to see examples of how they are used in different contexts. \n\nEnjoy your first day of German learning! \n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "now crete a prompt for the request leaving placeholder for language and day\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, here's a prompt template for your language learning requests:\n\n**Prompt:**\n\nI am developing a language learning application and need help creating structured words and sentences for learners. Please provide me with:\n\n* **5 new words** in **[LANGUAGE]**\n* **5 new sentences** using those words.\n\n**Please specify the language and day:**\n\n* **Language:** [LANGUAGE] (e.g., German, Spanish, Japanese)\n* **Day:** [DAY] (e.g., Day 2, Day 5, etc.)\n\nThis will help me generate relevant and effective language learning content for your app. \n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "lets test the output\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, I'm ready to test the output! \n\nPlease tell me the:\n\n* **Language:** (e.g., Spanish)\n* **Day:** (e.g., Day 2) \n\nI'll then generate 5 new words and 5 sentences for you to use in your app.  Let's see how it goes! 😄 \n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "Language : french\nday : 6"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "## French - Day 6 \n\n**New Words:**\n\n1. **Le"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "I am developing a language learning application and need help creating structured words and sentences for learners. Please provide me with:\n5 new words in french\n5 new sentences using those words.\nPlease specify the language and day:\nLanguage: french \nDay:  DAY 6"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "## French - Day 6\n\n**New Words:**\n\n1. **Le marché** (lə marʃe) - the market\n2. **Les fruits** (le fʁɥi) - the fruits\n3. **Le pain** (lə pɛ̃) - the bread\n4. **Le fromage** (lə fʁɔmaʒ) - the cheese\n5. **Le vin** (lə vɛ̃) - the wine\n\n**Sentences:**\n\n1. **J'aime aller au marché le samedi matin.** (ʒɛm ale o marʃe lə samdi matɛ̃) - I like to go to the market on Saturday morning.\n2. **Il y a beaucoup de fruits frais au marché.** (il ja boku də fʁɥi fre o marʃe) - There are many fresh fruits at the market.\n3. **Je voudrais acheter une baguette de pain, s'il vous plaît.** (ʒə vudʁɛ ateʃte yn bagɛt də pɛ̃ sil vu ple) - I would like to buy a baguette of bread, please.\n4. **Le fromage français est délicieux.** (lə fʁɔmaʒ fʁɑ̃sɛ ɛ delysjø) - French cheese is delicious.\n5. **On peut boire du vin rouge ou du vin blanc.** (ɔ̃ pø bwaʁ dy vɛ̃ ruʒ u dy vɛ̃ blɑ̃) - You can drink red wine or white wine.\n\n**Tips for Learning:**\n\n* **Practice pronunciation:** Pay attention to the sounds of each word and practice saying them correctly.\n* **Learn in context:** The sentences provide a context for understanding the meaning of the words.\n* **Use flashcards:** Create flashcards with the words and their translations to help you memorize them.\n* **Immerse yourself:** Listen to French music, watch French movies, and read French books or articles to help you learn the language naturally.\n\nEnjoy learning French! \n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "I am developing a language learning application and need help creating structured words and sentences for learners. Please provide me with:\n5 new words in germen\n5 new sentences using those words.\nPlease specify the language and day:\nLanguage: Germen\nDay: DAY 6"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "{\"New Words\": [\"Der Tag\", \"Die Nacht\", \"Das Wetter\", \"Die Sonne\", \"Der Regen\"], \"Sentences\": [\"Der Tag ist schön.\", \"Die Nacht ist dunkel.\", \"Das Wetter ist heute gut.\", \"Die Sonne scheint.\", \"Der Regen fällt.\"]}\n"},
          ],
        },
      ],
    });
  
    const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    console.log(result.response.text());
  }
  
  run();