import express, { Router, json } from "express";
import { config } from "dotenv";
import productsRouter from "./routes/product.router.js";
import audienceRouter from "./routes/audience.router.js";
import database from "./services/database.js";

config();

const app = express();
const port = 3000;

const router = new Router();
app.use(json());
app.use("/api", router);
app.use("/api/products", productsRouter);
app.use("/api/audience", audienceRouter);

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
  database.connect();
});
