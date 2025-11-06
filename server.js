const express = require("express");
const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Route for "/"
app.get("/", (req, res) => {
  res.send("Welcome to the homepage!");
});

// Route for "/mypost" - example POST handler
app.post("/mypost", (req, res) => {
  const data = req.body;
  // Process the posted data as needed
  res.json({ message: "Data received successfully", receivedData: data });
});

// Route for "/api" - example GET handler returning JSON data
app.get("/api", (req, res) => {
  res.json({ status: "API is working", timestamp: new Date().toISOString() });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
// mongodb+srv://myadmin:adminpassword@anubhavs-cluster.uxmbt5j.mongodb.net/?appName=Anubhavs-Cluster
