const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// npm install dotenv 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vh8a9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db('BD-Travel');
    const servicesCullection = database.collection('Travel');
    const orderCollection = database.collection("orders");

    // GET API
    app.get('/Travels', async (req, res) => {
      const cursor = servicesCullection.find({});
      const Travel = await cursor.toArray();
      res.send(Travel);
    })

    // GET SINGLE API
    app.get('/Travels/:id', async (req, res) => {
      const id = req.params.id;
      console.log('getting specific service', id);
      const query = {_id: ObjectId(id)};
      const Travel = await servicesCullection.findOne(query);
      res.json(Travel);
    })

    // POST API
    app.post("/Travels", async (req, res) => {
      const Travel = req.body;
      console.log('post the hit api', Travel)
      const result = await servicesCullection.insertOne(Travel);
      res.json(result)
    });

    // DELETE API
    app.delete("/Travels/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await servicesCullection.deleteOne(query);
      res.json(result);
    })

    // ADD ORDERS API
    app.post('/orders', async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.json(result);
    })

  } 
  
  finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Remaining BdTravel Backend server");
});

app.listen(port, () => {
  console.log("Running BdTravel server on port", port);
});
