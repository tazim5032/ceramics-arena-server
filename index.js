const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o4eqbyc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);
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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const craftCollection = client.db('craftDB').collection('craft');
        const categoryCollection = client.db('craftDB').collection('allCategory');

        //add form theke db te pathabo
        //client e fetch operation korte hbe..so go to client and send data into body
        app.post('/craft', async (req, res) => {
            console.log(req.body);
            const result = await craftCollection.insertOne(req.body);
            console.log(result);
            res.send(result); //result jabe client er .then er votore je data ace oikhane
        })

        //all data pawar jonno
        app.get('/craft', async (req, res) => {
            //onekgula data tai array te convert kore nilam
            const result = await craftCollection.find({}).toArray();
            res.send(result);
        })

        //sob category pawar jonno
        app.get('/allCategory', async (req, res) => {
            const result = await categoryCollection.find({}).toArray();
            res.send(result);
        })

        //single category er element gula pawar jonno
        app.get('/allCategory/:subcategory', async (req, res) => {
            const subcategory = req.params.subcategory;
            const query = {subcategory: subcategory}
            const result = await craftCollection.find(query).toArray();
            res.send(result);
            console.log(result)
        })

        //mylist show korar jonno
        app.get('/craft/:email', async (req, res) => {
            //onekgula data tai array te convert kore nilam
            const result = await craftCollection.find({ email: req.params.email }).toArray();
            res.send(result);
        })

        //details page er jonno
        app.get('/singleProduct/:id', async (req, res) => {
            //_id dia khujle ObjectId use korte hbe
            const result = await craftCollection.findOne({ _id: new ObjectId(req.params.id) });
            res.send(result);
            //console.log(result);
        })

        //update product korar jonno data fetch kore client e dekhabo
        app.get('/updateProduct/:id', async (req, res) => {
            const result = await craftCollection.findOne({ _id: new ObjectId(req.params.id) });
            res.send(result);

        })

        //client side e update confirm korar por
        app.put('/updateProduct/:id', async (req, res) => {
            const query = { _id: new ObjectId(req.params.id) }
            const updatedData = req.body;
            const options = { upsert: true }
            const data = {
                $set: {
                    name: updatedData.name,
                    subcategory: updatedData.subcategory,
                    description: updatedData.description,
                    price: updatedData.price,
                    rating: updatedData.rating,
                    time: updatedData.time,
                    customization: updatedData.customization,
                    stockStatus: updatedData.stockStatus,
                    photo: updatedData.photo
                },
            };

            const result = await craftCollection.updateOne(query, data, options);
            console.log(result);

            res.send(result);
        })

        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await craftCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        })

        //get the first element of each category
        


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        
        //await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server is running!')
})

app.listen(port, () => {
    console.log(`server is runnig at port ${port}`)
})