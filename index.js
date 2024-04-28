const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.SPOT_USER}:${process.env.SPOT_PASS}@cluster0.fxbdhbr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const userAddedCollection = client.db("UAddedDB").collection("UAddedSpots");
        const spotCollection = client.db("spotsDB").collection("spots");

        // get user for home page
        app.get('/homeSpots', async(req, res)=>{
            const cursor = spotCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        

        // Post user
        app.post('/userAddedSpot', async(req, res)=>{
            const newSpot = req.body;
            const result = await userAddedCollection.insertOne(newSpot);
            res.send(result)
        })







        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Server Side Root Response')
});

app.listen(port, () => {
    console.log(`Server Running In Port : ${port}`);
})