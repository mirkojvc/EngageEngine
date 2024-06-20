import { Router } from "express";
import database from "../services/database.js";
import { getSocialCampaign } from "../services/social.service.js";
import { ObjectId } from "mongodb";

const socialRouter = new Router();

socialRouter.post("/:id", async (req, res) => {
  try {
    const { id: personaId } = req.params;

    const dbSocialCampaign = await database.socialCollection.findOne({
      personaId,
    });
    if (dbSocialCampaign) {
      return res.status(200).json(dbSocialCampaign);
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
    const social = await getSocialCampaign(product, persona);

    const { insertedId } = await database.socialCollection.insertOne({
      ...social,
      personaId,
    });
    const socialCampaign = await database.socialCollection.findOne({
      _id: insertedId,
    });

    return res.status(201).json(socialCampaign);
  } catch (e) {
    console.error("Failed to create socialCampaign", e);
    return res.status(500).send("Failed to create socialCampaign");
  }
});

socialRouter.get("/", async (req, res) => {
  try {
    const socialCampaigns = await database.socialCollection.find().toArray();
    return res.status(200).json(socialCampaigns);
  } catch (e) {
    console.error("Failed to get socialCampaigns", e);
    return res.status(500).send("Failed to get socialCampaigns");
  }
});

socialRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = new ObjectId(id);
    const response = await database.socialCollection.deleteOne({
      _id: objectId,
    });

    if (response.deletedCount === 0) {
      return res.status(404).send("SocialCampaign not found");
    }

    return res.status(204).send("SocialCampaign deleted successfully");
  } catch (e) {
    console.error("Failed to delete socialCampaign", e);
    return res.status(500).send("Failed to delete socialCampaign");
  }
});

export default socialRouter;
