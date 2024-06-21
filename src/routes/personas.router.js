import { Router } from "express";
import database from "../services/database.js";
import getPersonaForProductAudience from "../services/persona.service.js";
import { ObjectId } from "mongodb";
const personasRouter = new Router();

//[ { "Profession":"Student", "Age":"16-25", "Needs":"Keep their frequently used device clean and free from germs. Also, assist in maintaining the longevity of their phone." },
// { "Profession":"IT Professional", "Age":"22-45", "Needs":"Have a clean phone to support their day-to-day work requirement. Possibly reduce the chance of spreading germs." }, { "Profession":"Healthcare Worker", "Age":"24-60", "Needs":"Necessity to keep their phone clean due to their work environment." }, { "Profession":"Office Worker", "Age":"22-60", "Needs":"Maintaining phone cleanliness to adhere to office etiquettes and hygiene standards." }, { "Profession":"Salesperson", "Age":"20-60", "Needs":"Frequent handling of the phone might necessitate a cleaner phone. Assist in maintaining professionalism during client interactions." }, { "Profession":"Driver (Taxi, Delivery, etc.)", "Age":"18-60", "Needs":"Keeping their device clean as they might interact with different clients throughout the day." }, { "Profession":"Educator", "Age":"24-60", "Needs":"May want to maintain a clean phone to impart good hygiene habits by example." }, { "Profession":"Retiree", "Age":"60+", "Needs":"May value cleanliness or be concerned about germs, especially amidst the current pandemic situations." }, { "Profession":"Parent", "Age":"18-60", "Needs":"Might often share their phone with young children so they may need to keep it clean." } ]

personasRouter.post("/:id", async (req, res) => {
  try {
    const { id: audienceId } = req.params;

    const dbPersona = await database.personasCollection.findOne({ audienceId });
    if (dbPersona) {
      return res.status(200).json(dbPersona);
    }
    console.log("audienceId", audienceId);
    const audience = await database.audienceCollection.findOne({
      _id: new ObjectId(audienceId),
    });

    if (!audience) {
      return res.status(404).send("Audience not found");
    }
    console.log("audience", audience);
    const product = await database.productCollection.findOne({
      _id: new ObjectId(audience.productId),
    });

    const persona = await getPersonaForProductAudience(product, audience);
    const { insertedId } = await database.personasCollection.insertOne({
      ...persona,
      audienceId,
    });

    const data = await database.personasCollection.findOne({
      _id: insertedId,
    });
    return res.status(201).json(data);
  } catch (e) {
    console.log(e);
    console.error("Failed to create personas for audience", e.response);
    return res.status(500).send("Failed to create personas for audience");
  }
});

personasRouter.get("/", async (req, res) => {
  try {
    const personas = await database.personasCollection.find().toArray();
    return res.status(200).json(personas);
  } catch (e) {
    console.error("Failed to get personas", e);
    return res.status(500).send("Failed to get personas");
  }
});

personasRouter.get("/:audienceId", async (req, res) => {
  try {
    const { audienceId } = req.params;
    const persona = await database.personasCollection.findOne({
      audienceId: audienceId,
    });
    return res.status(200).json(persona);
  } catch (e) {
    console.error("Failed to get persona", e);
    return res.status(500).send("Failed to get persona");
  }
});

personasRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = new ObjectId(id);
    const response = await database.personasCollection.deleteOne({
      _id: objectId,
    });
    if (response.deletedCount === 1) {
      return res.status(200).send("Persona deleted successfully");
    }
    return res.status(404).send("Persona not found");
  } catch (e) {
    console.error("Failed to delete persona", e);
    return res.status(500).send("Failed to delete persona");
  }
});

export default personasRouter;
