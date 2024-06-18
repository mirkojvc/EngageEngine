import { MongoClient } from "mongodb";

class Database {
  connect() {
    this.client = new MongoClient(process.env.MONGO_URI);
    this.init();
  }

  async init() {
    try {
      await this.client.connect();
      this.db = this.client.db(process.env.MONGO_DB);
      this.productCollection = this.db.collection("products");
      console.log("Connected to the database");
    } catch (error) {
      console.error("Error connecting to the database");
      console.error(error);
    }
  }
}

const database = new Database();
export default database;
