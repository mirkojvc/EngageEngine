import { PERSONA_PROMPTS } from "../prompts/persona.propts.js";
import callOpenAiApi, { createAIMessage } from "./aiservice.js";
import { createProductMessage } from "./audience.service.js";

export default async function getPersonaForProductAudience(product, audience) {
  const product_message = createProductMessage(product);
  const audience_message = createAudienceMessage(audience);
  const prompt = `${product_message} ${audience_message} ${PERSONA_PROMPTS.GENERATE.MESSAGE}`;
  const message = createAIMessage("user", prompt);
  const response = await callOpenAiApi(message);

  return JSON.parse(response.choices[0].message.content);
}

export function createAudienceMessage(audience) {
  return `[AUDIENCE]= PROFESSION: ${audience.profession}, AGE: ${audience.age}, NEEDS: ${audience.needs}`;
}
