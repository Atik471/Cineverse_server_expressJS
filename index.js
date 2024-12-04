const express = require('express');
const cors = require('cors');
require('dotenv').config();
// const { ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://cineverse_admin1:yCU9dkXu3Pk07dFu@cluster0.8nuar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    const moviesCollection = client.db("cineverse").collection("movies");

    app.post('/movies/add/', async(req, res) => {
      try {
        const newMovie = req.body;
        const result = await moviesCollection.insertOne(newMovie);

        res.status(200).json({ message: "Movie added successfully", movieId: result.insertedId });
      }
      catch (error) {
        console.error("Error adding movie:", error);
        res.status(500).json({ error: "Failed to add movie" });
      }
    })

    app.get('/movies', async(req, res) => {
      try {
        const movies = await moviesCollection.find().toArray(); 
        res.json(movies);
      }
      catch (error) {
        console.error("Error retreiving movies:", error);
        res.status(500).json({ error: "Failed to add movie" });
      }
    })

    app.get('/movies/:id', async(req, res) => {
      try {
        const { id } = req.params;
        const movie = await moviesCollection.findOne({ _id: new ObjectId(id) }); 

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: "Invalid movie ID format" });
        }

        if (!movie) {
          return res.status(404).json({ error: "Movie not found" });
        }
    
        res.json(movie);
      }
      catch (error) {
        console.error("Error retreiving movie:", error);
        res.status(500).json({ error: "Failed to add movie" });
      }
    })
    

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("running cineverse")
})

app.listen(port);