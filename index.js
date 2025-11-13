const express = require('express')
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port =process.env.PORT || 3000


// Midlewire
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_REVIEWS}:${process.env.DB_PASS}@cluster0.ahmyuia.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const db = client.db('foodLover_db')
    const reviewsCollection = db.collection('reviews')

  // Get-All
  app.get('/reviews', async (req,res)=>{
    
    const result = await reviewsCollection.find().toArray()
    res.send(result)
  })

  app.get('/featuredreviews', async (req, res) => {
  
    const cursor = reviewsCollection.find().sort({ rating: -1 }).limit(6);
    const result = await cursor.toArray();
    res.send(result);
  
});

  // POST
   app.post('/reviews', async (req,res)=>{
       const newreview = req.body
       const result = await reviewsCollection.insertOne(newreview)
       res.send(result)
   })

  

  //Find-one
   app.get('/reviews/:id', async(req,res)=>{
    const id = req.params.id
    const query = {
      _id: new ObjectId(id)
    }
    const result = await reviewsCollection.findOne(query)
    res.send(result)
    
   })

  //  GetMyReviews
  app.get('/my-reviews', async (req,res)=>{
    console.log(req.headers)

    const email = req.query.email
    const result = await reviewsCollection.find({email:email}).toArray()
    res.send(result)
  } )
   
  //  DELETE
   app.delete('/reviews/:id', async (req, res)=>{
    const id = req.params.id
    const query = {
      _id: new ObjectId(id)
    }
    const result = await reviewsCollection.deleteOne(query)
    res.send(result)
   })

   app.put('/reviews/:id', async (req,res)=>{
    const id = req.params.id
    const updatedReview = req.body
    const query = {_id: new ObjectId(id)}
    const update = {
      $set : updatedReview
    }
    const result = await reviewsCollection.updateOne(query,update)
    res.send(result)
   })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);




app.listen(port, () => {
  console.log(`RUNNIG ON ${port}`)
})
