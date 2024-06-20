import { Router } from "express";
import database from "../services/database.js";
import { getAudienceForProduct } from "../services/audience.service.js";
import { ObjectId } from "mongodb";

//[ { "Profession":"Student", "Age":"16-25", "Needs":"Keep their frequently used device clean and free from germs. Also, assist in maintaining the longevity of their phone." },
// { "Profession":"IT Professional", "Age":"22-45", "Needs":"Have a clean phone to support their day-to-day work requirement. Possibly reduce the chance of spreading germs." }, { "Profession":"Healthcare Worker", "Age":"24-60", "Needs":"Necessity to keep their phone clean due to their work environment." }, { "Profession":"Office Worker", "Age":"22-60", "Needs":"Maintaining phone cleanliness to adhere to office etiquettes and hygiene standards." }, { "Profession":"Salesperson", "Age":"20-60", "Needs":"Frequent handling of the phone might necessitate a cleaner phone. Assist in maintaining professionalism during client interactions." }, { "Profession":"Driver (Taxi, Delivery, etc.)", "Age":"18-60", "Needs":"Keeping their device clean as they might interact with different clients throughout the day." }, { "Profession":"Educator", "Age":"24-60", "Needs":"May want to maintain a clean phone to impart good hygiene habits by example." }, { "Profession":"Retiree", "Age":"60+", "Needs":"May value cleanliness or be concerned about germs, especially amidst the current pandemic situations." }, { "Profession":"Parent", "Age":"18-60", "Needs":"Might often share their phone with young children so they may need to keep it clean." } ]

const audienceRouter = new Router();

audienceRouter.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const objectId = new ObjectId(id);
    const product = await database.productCollection.findOne({
      _id: objectId,
    });

    const response = await getAudienceForProduct(product);
    const audiences = response.audiences;

    await database.audienceCollection.insertMany(
      audiences.map((audience) => {
        return {
          ...audience,
          productId: id,
        };
      })
    );

    const data = await database.audienceCollection
      .find({
        productId: id,
      })
      .toArray();
    return res.status(201).json(data);
  } catch (e) {
    console.log(e);
    // console.error("Failed to create audience for product", e.response);
    return res.status(500).send("Failed to create audience for product");
  }
});

audienceRouter.get("/", async (req, res) => {
  try {
    const audiences = await database.audienceCollection.find().toArray();
    return res.status(200).json(audiences);
  } catch (e) {
    console.error("Failed to get audiences", e);
    return res.status(500).send("Failed to get audiences");
  }
});

audienceRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = new ObjectId(id);
    const response = await database.audienceCollection.deleteOne({
      _id: objectId,
    });
    if (response.deletedCount === 1) {
      return res.status(200).send("Audience deleted successfully");
    }
    return res.status(404).send("Audience not found");
  } catch (e) {
    console.error("Failed to delete audience", e);
    return res.status(500).send("Failed to delete audience");
  }
});

audienceRouter.delete("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await database.audienceCollection.deleteMany({
      productId: id,
    });
    return res.status(200).send("Audiences deleted successfully");
  } catch (e) {
    console.error("Failed to delete audiences", e);
    return res.status(500).send("Failed to delete audiences");
  }
});

export default audienceRouter;
