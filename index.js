const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const fileUpload = require("express-fileupload")

require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload())
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
    const usersCollection = client.db("bicycleBarn").collection("users");

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
      console.log(result)
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

    //*UPDATE API
    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const updateDetails = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: updateDetails.status,
        },
      };
      const result = await ordersCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });

    //*Users get api
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role == "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    //*users post api
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });

    //*users put api
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    //*users admin api
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      console.log("put", user);
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Bicycle Barn Database Running on server!");
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
