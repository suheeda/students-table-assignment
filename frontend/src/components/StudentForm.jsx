import React, { useEffect, useState } from "react";

const initialState = { name: "", email: "", age: "" };

export default function StudentForm({ onSubmit, editingStudent, loading, onCancelEdit }) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingStudent) {
      setFormData({ name: editingStudent.name || "", email: editingStudent.email || "", age: editingStudent.age || "" });
      setErrors({});
    } else {
      setFormData(initialState);
    }
  }, [editingStudent]);

  const validate = () => {
    const nextErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.name.trim()) nextErrors.name = "Name is required";
    if (!formData.email.trim()) nextErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email.trim())) nextErrors.email = "Enter a valid email";
    if (!String(formData.age).trim()) nextErrors.age = "Age is required";
    else if (Number(formData.age) < 1 || Number(formData.age) > 100) nextErrors.age = "Enter a valid age";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    onSubmit({ ...formData, name: formData.name.trim(), email: formData.email.trim(), age: Number(formData.age) });
    if (!editingStudent) setFormData(initialState);
  };

  return (
    <div className="card">
      <h2 className="form-title">{editingStudent ? "Edit Student" : "Add Student"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="field-group">
          <label className="label">Student Name</label>
          <input className="input" type="text" name="name" placeholder="Enter full name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>
        <div className="field-group">
          <label className="label">Email Address</label>
          <input className="input" type="email" name="email" placeholder="Enter email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>
        <div className="field-group">
          <label className="label">Age</label>
          <input className="input" type="number" name="age" placeholder="Enter age" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
          {errors.age && <div className="error">{errors.age}</div>}
        </div>
        <div className="actions-row">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? <><span className="loader" /> {editingStudent ? "Updating..." : "Adding..."}</> : (editingStudent ? "Update Student" : "Add Student")}
          </button>
          {editingStudent && <button className="btn btn-secondary" type="button" onClick={onCancelEdit} disabled={loading}>Cancel Edit</button>}
        </div>
      </form>
    </div>
  );
}
