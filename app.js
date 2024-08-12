const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const ejs = require("ejs");
const Task = require("./models/task.js");

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/task");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

// Helper function to render views with layout
function renderWithLayout(res, view, locals) {
  ejs.renderFile(path.join(__dirname, "views", view), locals, (err, html) => {
    if (err) {
      return res.status(500).send(err.toString());
    }
    ejs.renderFile(
      path.join(__dirname, "views", "layouts", "main.ejs"),
      { body: html },
      (err, finalHtml) => {
        if (err) {
          return res.status(500).send(err.toString());
        }
        res.send(finalHtml);
      }
    );
  });
}

// Routes
app.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    renderWithLayout(res, "index.ejs", { tasks });
  } catch (err) {
    res.status(500).send("Error fetching tasks: " + err.message);
  }
});

// Include other routes
const taskRoutes = require("./routes/index");
app.use("/", taskRoutes);

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
