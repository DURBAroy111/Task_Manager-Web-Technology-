const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Load initial data from data.json
let data = [];
try {
  data = JSON.parse(fs.readFileSync("data.json"));
} catch (error) {
  console.error("Error reading data.json:", error);
}

// Middleware to validate task for POST and PUT methods
const validateTask_POST_PUT_Method = (req, res, next) => {
  const { title, description, status } = req.body;

  if (!title || !description || !status) {
    return res
      .status(400)
      .json({ error: "Title, description, and status are required" });
  }
  next();
};

// Middleware to validate task for PATCH method
const validateTask_PATCH_Method = (req, res, next) => {
  const { title, description, status } = req.body;

  if (!title && !description && !status) {
    return res
      .status(400)
      .json({ error: "Title or description or status is required" });
  }
  next();
};

// Define status ranking
const statusRank = {
  "TO DO": 1,
  "In Progress": 2,
  Completed: 3,
};

// Export app for use in other files
module.exports = app;

app.get("/", (req, res) => {
  res.send("Welcome to the Task API!");
});

// GET route to retrieve all tasks
app.get("/taskList", (req, res) => {
  try {
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST route to add a new task
app.post("/taskList", validateTask_POST_PUT_Method, (req, res) => {
  try {
    const newTask = {
      id: data.length + 1,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
    };
    data.push(newTask);
    fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
