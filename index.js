const express = require('express')
const app = express()
const cors =require ('cors')
const port = process.env.PORT||5000
const { MongoClient } = require('mongodb');
const ObjectId =require('mongodb').ObjectId;
require('dotenv').config()
 
app.use(cors())
app.use(express.json())

const uri=`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@tourism.utesk.mongodb.net/jewels_mart?retryWrites=true&w=majority`
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
 
async function run() {
  try {
    await client.connect();
    const database = client.db('jewels_mart');
    const productsCollection = database.collection('products');
    const ordersCollection = database.collection('orders');
    const usersCollection=database.collection('users')
    const reviewsCollection=database.collection('reviews')
           // get api
    app.get('/products',async(req,res)=>{
      const cursor = productsCollection.find({});
      const products=await cursor.toArray()
      res.send(products)
    })
    app.get('/reviews',async(req,res)=>{
      const cursor = reviewsCollection.find({});
      const reviews=await cursor.toArray()
      res.send(reviews)
    })
           // single id

    app.get('/products/:id',async(req,res)=>{
      const id =req.params.id;
      const query={_id: ObjectId(id)}
      const product = await productsCollection.findOne(query);
      
      res.json(product)
    })
   
    
    // POST products to database
  app.post('/products', async (req, res)=> {
    const product=req.body
    const result = await productsCollection.insertOne(product)
    res.send(result)
   })
   app.get('/orders',async(req,res)=>{
    const cursor = ordersCollection.find({});
    const orders=await cursor.toArray()
    res.send(orders)
  })
   app.get('/orders',async(req,res)=>{
     let query={};
     if(email){
       query={email:email}
     }
     const email=req.query.email
     
    const cursor = ordersCollection.find(query);
    const orders=await cursor.toArray()
    res.send(orders)
  })
   app.post('/orders', async (req, res)=> {
    const order=req.body
    const result = await ordersCollection.insertOne(order)
    res.send(result)
   })
  app.post('/reviews', async (req, res)=> {
    const review=req.body
    const result = await reviewsCollection.insertOne(review)
    res.send(result)
   })
   //delete api
   app.delete('/products/:id',async(req,res)=>{
    const id =req.params.id;
    const query={_id: ObjectId(id)}
    const result = await productsCollection.deleteOne(query);
    
    res.json(result)
  })
  //get users
  app.get('/users/:email',async(req,res)=>{
    const email =req.params.email;
    const query={email:email}
    const user =await usersCollection.findOne(query)
    let isAdmin=false;
    if(user?.role==='admin'){
      isAdmin=true;
    }
    res.json({admin:isAdmin})
  })
    // POST users to database
  app.post('/users', async (req, res)=> {
    const user=req.body
    const result = await usersCollection.insertOne(user)
    res.send(result)
   }) 
  app.put('/users', async (req, res)=> {
    const user=req.body
    const filter={email: user.email}
    const options={ upsert: true}
    const updateDoc={ $set: user}
    const result = await usersCollection.updateOne(filter,updateDoc,options)
    res.json(result)
   }) 
   //addmin
  app.put('/users/admin', async (req, res)=> {
    const user=req.body
    console.log('putting admin',user)
    const filter={email: user?.email}
    console.log('putting admin',filter)
    const updateDoc={ $set: {role:'admin'}}
    console.log("admin role update")
    const result = await usersCollection.updateOne(filter,updateDoc)
    res.json(result)
   }) 

    
  }
  finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('Hello World!')
})
 
app.listen(port, () => {
  console.log(`listening :${port}`)
})
