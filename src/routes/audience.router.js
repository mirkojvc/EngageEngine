import { Router } from "express";
import database from "../services/database.js";
import { getAudienceForProduct } from "../services/audience.service.js";
const audienceRouter = new Router();

audienceRouter.get("/audience-for-product/:id", async (req, res) => {
  try {
    const { id } = req.query;
    const product = database.productCollection.findOne({ _id: id });
    const response = await getAudienceForProduct(product);
    res.send(response);
  } catch (e) {
    console.error(
      "Failed to create audience for product",
      e.response.data.error
    );
    return res.status(500).send("Failed to create audience for product");
  }
});

export default audienceRouter;
