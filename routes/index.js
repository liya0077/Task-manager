const express = require("express");
const router = express.Router();
const Task = require("../models/task");

// Home Page: List all tasks
router.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.render("index", { tasks });
});

// Add a new task
router.post("/add", async (req, res) => {
  const { title, description } = req.body;
  await Task.create({ title, description });
  res.redirect("/");
});

// Mark task as complete/incomplete
router.post("/complete/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.completed = !task.completed;
  await task.save();
  res.redirect("/");
});

// Delete a task
router.post("/delete/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

module.exports = router;
