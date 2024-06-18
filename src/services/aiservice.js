import axios from "axios";

export function createAIMessage(role, content) {
  return { role, content };
}

export default async function callOpenAiApi(messages, temperature = 0) {
  const url = process.env.DIAL_ENDPOINT;
  const headers = {
    "Content-Type": "application/json",
    "Api-Key": process.env.DIAL_KEY,
  };
  const data = {
    messages: [messages],
    temperature,
    model: process.env.DIAL_MODEL_ID,
  };

  try {
    console.log("Calling OpenAI API with data:", data);
    console.log("Calling OpenAI API with data:", url);
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}
