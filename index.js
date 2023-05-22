const express = require("express");
var morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const app = express();

const Person = require("./models/person");

app.use(morgan(":method :url :status - :response-time ms :body"));

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

let persons = [];

app.get("/api/persons", (req, res) => {
  Person.find({}).then((people) => {
    res.json(people);
  });
});

app.get("/info", (req, res) => {
  const personsLength = persons.length;
  const date = new Date();
  const options = {
    weekday: "short",
    month: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  res.send(`<p>Phonebook has info for ${personsLength} people </p>
  <p>${date.toLocaleDateString("en-US", options)} ${date.toLocaleTimeString(
    "en-US"
  )}</p>`);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (body.name === undefined) {
    return res.status(400).json({ error: "name missing" });
  }

  if (body.number === undefined) {
    return res.status(400).json({ error: "number missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
