import { AUDIENCE_PROMPTS } from "../prompts/audience.prompts.js";
import callOpenAiApi, { createAIMessage } from "./aiservice.js";

export async function getAudienceForProduct(product) {
  const product_message = createProductMessage(product);
  const prompt = `${product_message} ${AUDIENCE_PROMPTS.GENERATE.MESSAGE}`;
  const message = createAIMessage("user", prompt);
  const response = await callOpenAiApi(message);
  return JSON.parse(response.choices[0].message.content);
}

export function createProductMessage(product) {
  return `[PRODUCT]= NAME: ${product.name}, DESCRIPTION: ${product.description}, MARKET: ${product.market}`;
}
