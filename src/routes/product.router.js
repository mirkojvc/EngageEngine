import { Router } from "express";
import callOpenAiApi, { createAIMessage } from "../services/aiservice.js";
import { parseMessage } from "../utils/helpers.js";
import database from "../services/database.js";

const router = new Router();

router.post("/", async (req, res) => {
  try {
    const { name, description, market } = req.body;

    const { insertedId } = await database.productCollection.insertOne({
      name,
      description,
      market,
    });

    const product = await database.productCollection.findOne({
      _id: insertedId,
    });

    return res.status(201).json(product);
  } catch (e) {
    console.error("Failed to create product", e);
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await database.productCollection.find().toArray();

    return res.status(200).json(products);
  } catch (e) {
    console.error("Failed to get products", e);
  }
});

export default router;
