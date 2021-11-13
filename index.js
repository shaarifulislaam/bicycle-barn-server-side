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
    const reviewsCollection = client.db("bicycleBarn").collection("reviews");

    //*GET API or GET all product
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });
    //*GET API for single product
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.json(product);
    });
    //*ADD Product
    app.post("/products", async (req, res) => {
      const result = await productsCollection.insertOne(req.body);
      res.json(result);
    });
    //*GET API or GET all product
    app.get("/reviews", async (req, res) => {
      const cursor = reviewsCollection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
    });
    //*ADD reviews
    app.post("/reviews", async (req, res) => {
      const result = await reviewsCollection.insertOne(req.body);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Bicycle Barn Database Running!");
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
