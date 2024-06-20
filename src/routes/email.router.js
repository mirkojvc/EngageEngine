import { Router } from "express";
import database from "../services/database.js";
import { getEmailCampaign } from "../services/email.service.js";
import { ObjectId } from "mongodb";

//[ { "Profession":"Student", "Age":"16-25", "Needs":"Keep their frequently used device clean and free from germs. Also, assist in maintaining the longevity of their phone." },
// { "Profession":"IT Professional", "Age":"22-45", "Needs":"Have a clean phone to support their day-to-day work requirement. Possibly reduce the chance of spreading germs." }, { "Profession":"Healthcare Worker", "Age":"24-60", "Needs":"Necessity to keep their phone clean due to their work environment." }, { "Profession":"Office Worker", "Age":"22-60", "Needs":"Maintaining phone cleanliness to adhere to office etiquettes and hygiene standards." }, { "Profession":"Salesperson", "Age":"20-60", "Needs":"Frequent handling of the phone might necessitate a cleaner phone. Assist in maintaining professionalism during client interactions." }, { "Profession":"Driver (Taxi, Delivery, etc.)", "Age":"18-60", "Needs":"Keeping their device clean as they might interact with different clients throughout the day." }, { "Profession":"Educator", "Age":"24-60", "Needs":"May want to maintain a clean phone to impart good hygiene habits by example." }, { "Profession":"Retiree", "Age":"60+", "Needs":"May value cleanliness or be concerned about germs, especially amidst the current pandemic situations." }, { "Profession":"Parent", "Age":"18-60", "Needs":"Might often share their phone with young children so they may need to keep it clean." } ]

const emailRouter = new Router();

emailRouter.post("/:id", async (req, res) => {
  try {
    const { id: personaId } = req.params;

    const dbEmailCampaign = await database.emailCollection.findOne({
      personaId,
    });
    if (dbEmailCampaign) {
      return res.status(200).json(dbEmailCampaign);
    }

    const persona = await database.personasCollection.findOne({
      _id: new ObjectId(personaId),
    });

    console.log("persona", persona);
    const audience = await database.audienceCollection.findOne({
      _id: new ObjectId(persona.audienceId),
    });
    const product = await database.productCollection.findOne({
      _id: new ObjectId(audience.productId),
    });
    const email = await getEmailCampaign(product, persona);

    const { insertedId } = await database.emailCollection.insertOne({
      ...email,
      personaId,
    });
    const emailCampaign = await database.emailCollection.findOne({
      _id: insertedId,
    });

    return res.status(201).json(emailCampaign);
  } catch (e) {
    console.error("Failed to create emailCampaign", e);
    return res.status(500).send("Failed to create emailCampaign");
  }
});

emailRouter.get("/", async (req, res) => {
  try {
    const emailCampaigns = await database.emailCollection.find().toArray();
    return res.status(200).json(emailCampaigns);
  } catch (e) {
    console.error("Failed to get emailCampaigns", e);
    return res.status(500).send("Failed to get emailCampaigns");
  }
});

emailRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = new ObjectId(id);
    const response = await database.emailCollection.deleteOne({
      _id: objectId,
    });

    if (response.deletedCount === 0) {
      return res.status(404).send("EmailCampaign not found");
    }

    return res.status(204).send("EmailCampaign deleted successfully");
  } catch (e) {
    console.error("Failed to delete emailCampaign", e);
    return res.status(500).send("Failed to delete emailCampaign");
  }
});

export default emailRouter;
