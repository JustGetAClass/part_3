const express = require("express");
var morgan = require("morgan");
const app = express();

app.use(morgan(":method :url :status - :response-time ms :body"));

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
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
  const id = Math.floor(Math.random() * 1000) + 5;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "details missing",
    });
  }

  const exists = persons.find((person) => person.name === body.name);
  if (exists) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: id,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  res.json(person);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
