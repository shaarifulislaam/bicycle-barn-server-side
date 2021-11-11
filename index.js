const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ip6hg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const productsCollection = client.db("bicycleBarn").collection("products");
    //*GET API or GET Home page product
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      // const products = await cursor.limit(3).toArray();
      res.send(products);
    });
    //*GET API or GET all product
    app.get("/allProducts", async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      // const products = await cursor.limit(3).toArray();
      res.send(products);
    });
    //*GET API for single product
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      // console.log("getting specific service", id);
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.json(product);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Database Running!");
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
