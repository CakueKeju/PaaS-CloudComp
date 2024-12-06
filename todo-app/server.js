const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("views"));

let tasks = [];

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

app.post("/add", (req, res) => {
    const task = req.body.task;
    if (task) tasks.push(task);
    res.redirect("/");
});

app.post("/delete", (req, res) => {
    tasks = [];
    res.redirect("/");
});

app.get("/tasks", (req, res) => {
    res.json(tasks);
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});