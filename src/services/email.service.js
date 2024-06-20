import { EMAIL_PROMPTS } from "../prompts/email.prompt.js";
import callOpenAiApi, { createAIMessage } from "./aiservice.js";
import { createProductMessage } from "./audience.service.js";
import { createAudienceMessage } from "./persona.service.js";

export async function getEmailCampaign(product, persona) {
  const product_message = createProductMessage(product);
  const persona_message = createAudienceMessage(persona);
  const prompt = `${product_message} ${persona_message} ${EMAIL_PROMPTS.GENERATE.MESSAGE}`;
  const message = createAIMessage("user", prompt);
  const response = await callOpenAiApi(message);

  return JSON.parse(response.choices[0].message.content);
}
