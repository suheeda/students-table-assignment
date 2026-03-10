import React, { useEffect, useMemo, useState } from "react";
import "./index.css";

const STORAGE_KEY = "students_table_data_v1";

const initialStudents = [
  { id: 1, name: "Aisha Khan", email: "aisha@example.com", age: 21 },
  { id: 2, name: "Rahul Verma", email: "rahul@example.com", age: 22 },
  { id: 3, name: "Meera Nair", email: "meera@example.com", age: 20 },
];

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    age: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setStudents(JSON.parse(saved));
    } else {
      setStudents(initialStudents);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStudents));
    }
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    }
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const q = search.toLowerCase();
      return (
        student.name.toLowerCase().includes(q) ||
        student.email.toLowerCase().includes(q) ||
        String(student.age).includes(q)
      );
    });
  }, [students, search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const resetForm = () => {
    setForm({ id: null, name: "", email: "", age: "" });
    setIsEditing(false);
    setError("");
  };

  const validate = () => {
    const { name, email, age } = form;

    if (!name.trim() || !email.trim() || !age) {
      return "All fields are required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return "Invalid email format.";
    }

    const numericAge = Number(age);
    if (Number.isNaN(numericAge) || numericAge < 1 || numericAge > 100) {
      return "Age must be a valid number between 1 and 100.";
    }

    const duplicateEmail = students.some(
      (student) =>
        student.email.toLowerCase() === email.trim().toLowerCase() &&
        student.id !== form.id
    );

    if (duplicateEmail) {
      return "Email already exists.";
    }

    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const studentData = {
      id: isEditing ? form.id : Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      age: Number(form.age),
    };

    if (isEditing) {
      setStudents((prev) =>
        prev.map((student) =>
          student.id === form.id ? studentData : student
        )
      );
    } else {
      setStudents((prev) => [...prev, studentData]);
    }

    resetForm();
  };

  const handleEdit = (student) => {
    setForm({
      id: student.id,
      name: student.name,
      email: student.email,
      age: String(student.age),
    });
    setIsEditing(true);
    setError("");
  };

  const handleDelete = (id) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
    if (isEditing && form.id === id) {
      resetForm();
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Students Table</h1>

        <form className="card form-card" onSubmit={handleSubmit}>
          <div className="grid">
            <input
              type="text"
              name="name"
              placeholder="Enter name"
              value={form.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
            />
            <input
              type="number"
              name="age"
              placeholder="Enter age"
              value={form.age}
              onChange={handleChange}
            />
          </div>

          {error ? <p className="error">{error}</p> : null}

          <div className="button-row">
            <button type="submit">
              {isEditing ? "Update Student" : "Add Student"}
            </button>
            {isEditing ? (
              <button
                type="button"
                className="secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <div className="card table-card">
          <div className="table-header">
            <h2>Student Records</h2>
            <input
              type="text"
              placeholder="Search by name, email or age"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search"
            />
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.age}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="small"
                            onClick={() => handleEdit(student)}
                          >
                            Edit
                          </button>
                          <button
                            className="small danger"
                            onClick={() => handleDelete(student.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}