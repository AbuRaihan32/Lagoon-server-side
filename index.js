const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());


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

        // get spots for home page
        app.get('/homeSpots', async(req, res)=>{
            const cursor = spotCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // get spots added by user
        app.get('/UAddedSpots', async(req, res)=>{
            const cursor = userAddedCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // get single spot 
        app.get('/homeSpot/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await spotCollection.findOne(query);
            res.send(result)
        })

        // get single UserSpot by id
        app.get('/userSpot/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await userAddedCollection.findOne(query);
            res.send(result)
        })


        // get spot by email:
        app.get('/userSpots/:email', async(req,res)=>{
            const email = req.params.email;
            const query = {User_Email: email}
            const result = await userAddedCollection.find(query).toArray();
            res.send(result)
        })

        // Post user
        app.post('/userAddedSpot', async(req, res)=>{
            const newSpot = req.body;
            const result = await userAddedCollection.insertOne(newSpot);
            res.send(result)
        })

        // update Spot
        app.patch('/userSpot/:id', async(req, res)=>{
            const id = req.params.id;
            const spot = req.body;
            const filter = {_id: new ObjectId(id)};
            const options = { upsert: true };
            const updatedSpot = {
                $set:{
                    image: spot.image, 
                    tourists_spot_name: spot.tourists_spot_name, 
                    country_Name: spot.country_Name, 
                    location: spot.location, 
                    short_description: spot.short_description, 
                    average_cost: spot.average_cost, 
                    seasonality: spot.seasonality, 
                    travel_time: spot.travel_time, 
                    totalVisitorsPerYear: spot.totalVisitorsPerYear, 
                    User_Email: spot.User_Email, 
                    User_Name: spot.User_Name
                }
            }
            const result = await userAddedCollection.updateOne(filter, updatedSpot, options)
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