const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
require('dotenv').config()

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2logags.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        const serviceCollection = client.db('cakeHouse').collection('services')
        const reviewCollection = client.db('cakeHouse').collection('reviews')


        app.get('/home', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const user = await cursor.limit(3).toArray();
            res.send(user)
        })
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const user = await cursor.toArray();
            res.send(user)
        })

        app.get('/services/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);

        })

        app.get('/reviews', async (req, res) => {

            const query = {}
            const cursor = reviewCollection.find(query)
            const review = await cursor.toArray();
            res.send(review)
        })

        app.post('/reviews', async (req, res) => {

            const review = req.body;
            const result = await reviewCollection.insertOne(review)

            res.send(result);

        })
    }

    finally {

    }
}
run().catch(err => console.error(err))



app.get('/', (req, res) => {
    res.send('service review ')
})

app.listen(port, () => {
    console.log(`listening to port ${port}`)
})