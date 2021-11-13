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
    const ordersCollection = client.db("bicycleBarn").collection("orders");

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
    //*DELETE API
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });
    //*GET API or GET all review
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
    //* add order
    app.post("/orders", async (req, res) => {
      const result = await ordersCollection.insertOne(req.body);
      console.log(result);
      res.send(result);
    });
    //* get all orders
    app.get("/orders", async (req, res) => {
      const result = await ordersCollection.find({}).toArray();
      res.send(result);
    });
    //*filter email API
    app.get("/orders/:email", async (req, res) => {
      const email = req.params.email;
      const query = await ordersCollection.find({ email });
      const result = await query.toArray();
      res.send(result);
    });
    //*DELETE Order API
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.send(result);
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
