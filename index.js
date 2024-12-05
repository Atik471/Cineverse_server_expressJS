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
    const favouriteCollection = client.db("cineverse").collection("favourites");

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

        if (!movie) {
          return res.status(404).json({ error: "Movie not found" });
        }
    
        res.json(movie);
      }
      catch (error) {
        console.error("Error retreiving movie:", error);
        res.status(500).json({ error: "Failed to retreive movie" });
      }
    })

    app.delete('/movies/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const deleteResult = await moviesCollection.deleteOne({ _id: new ObjectId(id) });
    
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ error: "Movie not found" });
        }
    
        res.status(200).json({ message: "Movie deleted successfully" });
      } catch (error) {
        console.error("Error deleting movie:", error);
        res.status(500).json({ error: "Failed to delete movie" });
      }
    });

    app.post('/movies/add-favourite', async(req, res) => {
      try {
        const favourite = req.body;
        const result = await favouriteCollection.insertOne(favourite);

        res.status(200).json({ message: "Favourite movie added successfully", _id: result.insertedId });
      }
      catch (error) {
        console.error("Error adding movie to favourites:", error);
        res.status(500).json({ error: "Failed to add movie to favourites" });
      }
    })
    
    app.get('/movies/favourites/:uid', async(req, res) => {
      try {
        const { uid } = req.params;
        const favourites = await favouriteCollection.find({ user: uid }).toArray();
        res.send(favourites)
      }
      catch(error) {
        console.error("Error fetching favourite movies:", error);
        res.status(500).json({ error: "Failed to fetch favourite movies" });
      }
    })

    app.delete('/movies/favourites/:favid', async (req, res) => {
      try {
        const { favid } = req.params;
        const deleteResult = await favouriteCollection.deleteOne({ _id: new ObjectId(favid) });
    
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ error: "Favourite Movie not found" });
        }
    
        res.status(200).json({ message: "Favourite Movie deleted successfully" });
      } catch (error) {
        console.error("Error deleting favourite movie:", error);
        res.status(500).json({ error: "Failed to delete favourite movie" });
      }
    });

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