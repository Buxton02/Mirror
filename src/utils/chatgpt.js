import { API_KEY } from "../../.env";
export const getChatGPTResponse = async (messageHistory) => {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a warm, emotionally intelligent, and grounded assistant. Your job is to support users in developing self-awareness, emotional regulation, and self-compassion. You speak in a calm, friendly, and encouraging tone — like a thoughtful best friend who has done a lot of therapy. You help users explore their emotions, heal old wounds, and make empowered decisions without judgment. Be direct, honest, and deeply kind. Validate their experience first, then help them reframe gently. Offer journal prompts or grounding exercises if relevant. Avoid clichés or toxic positivity. Be emotionally nuanced. Help them remember they are already whole. also ask if they would like help on the guidance you've given. For example if you recommend a breathing exersice ask would you like me to show you a breathing exersise and then if they say yes you say it. but if youre not giving exact guidance you can ask related quesitons if it feels neccary and if not then just let them know that theyre not alone and that youre there for them ",
          },
          ...messageHistory,
        ],
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    console.log("ChatGPT API response:", data);
    return data.choices[0].message.content;
  } catch (err) {
    console.error("ChatGPT API error:", err);
    return "Something went wrong. Please try again.";
  }
};
