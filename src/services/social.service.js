import { SOCIAL_CAMPAIGN_PROMPTS } from "../prompts/social.prompts.js";
import callOpenAiApi, { createAIMessage } from "./aiservice.js";
import { createProductMessage } from "./audience.service.js";
import { createAudienceMessage } from "./persona.service.js";

export async function getSocialCampaign(product, audience) {
  const product_message = createProductMessage(product);
  const audience_message = createAudienceMessage(audience);
  const prompt = `${product_message} ${audience_message} ${SOCIAL_CAMPAIGN_PROMPTS.GENERATE.MESSAGE}`;
  const message = createAIMessage("user", prompt);
  const response = await callOpenAiApi(message);

  return JSON.parse(response.choices[0].message.content);
}
