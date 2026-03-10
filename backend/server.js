const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.resolve(__dirname, "data", "students.json");

app.use(cors());
app.use(express.json());

const readStudents = () => JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
const writeStudents = (students) =>
  fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.get("/", (_req, res) => {
  res.send("Students backend is running");
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Backend is running" });
});

app.get("/api/students", async (_req, res) => {
  await delay(300);
  res.json(readStudents());
});

app.post("/api/students", async (req, res) => {
  await delay(300);
  const { name, email, age } = req.body;

  if (!name || !email || !age) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  const students = readStudents();
  const exists = students.some(
    (s) => s.email.toLowerCase() === email.toLowerCase()
  );

  if (exists) {
    return res.status(400).json({ message: "Email already exists." });
  }

  const newStudent = {
    id: Date.now(),
    name: name.trim(),
    email: email.trim(),
    age: Number(age),
  };

  students.push(newStudent);
  writeStudents(students);
  res.status(201).json(newStudent);
});

app.put("/api/students/:id", async (req, res) => {
  await delay(300);
  const id = Number(req.params.id);
  const { name, email, age } = req.body;

  if (!name || !email || !age) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  const students = readStudents();
  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Student not found." });
  }

  const exists = students.some(
    (s) => s.id !== id && s.email.toLowerCase() === email.toLowerCase()
  );

  if (exists) {
    return res.status(400).json({ message: "Email already exists." });
  }

  students[index] = {
    ...students[index],
    name: name.trim(),
    email: email.trim(),
    age: Number(age),
  };

  writeStudents(students);
  res.json(students[index]);
});

app.delete("/api/students/:id", async (req, res) => {
  await delay(300);
  const id = Number(req.params.id);
  const students = readStudents();
  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Student not found." });
  }

  const deletedStudent = students[index];
  students.splice(index, 1);
  writeStudents(students);

  res.json({ message: "Student deleted successfully.", deletedStudent });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});