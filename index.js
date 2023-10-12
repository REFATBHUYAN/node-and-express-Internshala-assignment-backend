const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { MongoClient, ServerApiVersion } = require("mongodb");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dp83dff.mongodb.net/?retryWrites=true&w=majority`;

//

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    //    get all data

    app.get("/data", async (req, res) => {

      // get the page number for pagiation
      const page = req.query.page || 1; 
      const pageSize = 3; 
      const startIndex = (page - 1) * pageSize;
      const endIndex = page * pageSize;
      // search query implement
      const searchQuery = req.query.search || '';
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        );
        const data = response.data;

        const filteredData = data.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

        const paginatedData = filteredData.slice(startIndex, endIndex);
        res.json({
          data: paginatedData,
          totalPages: Math.ceil(data.length / pageSize),
        });
        
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch data from the API" });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(" server is running.......");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
