import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import StudentForm from "./components/StudentForm";
import StudentTable from "./components/StudentTable";
import ConfirmModal from "./components/ConfirmModal";
import "./styles/app.css";

const API_URL = "http://localhost:5000/api/students";

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notice, setNotice] = useState({ type: "", message: "" });
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  const showNotice = (type, message) => {
    setNotice({ type, message });
    setTimeout(() => setNotice({ type: "", message: "" }), 2500);
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      showNotice("error", "Unable to load students. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const filteredStudents = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return students;
    return students.filter((student) => student.name.toLowerCase().includes(q) || student.email.toLowerCase().includes(q));
  }, [students, searchTerm]);

  const handleAddOrUpdate = async (studentData) => {
    try {
      setFormLoading(true);
      const isEditing = Boolean(editingStudent);
      const response = await fetch(isEditing ? `${API_URL}/${editingStudent.id}` : API_URL, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong.");
      await fetchStudents();
      setEditingStudent(null);
      showNotice("success", isEditing ? "Student updated successfully." : "Student added successfully.");
    } catch (error) {
      showNotice("error", error.message || "Operation failed.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    try {
      setDeleteLoading(true);
      const response = await fetch(`${API_URL}/${deleteCandidate.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Delete failed.");
      await fetchStudents();
      setDeleteCandidate(null);
      if (editingStudent && editingStudent.id === deleteCandidate.id) setEditingStudent(null);
      showNotice("success", "Student deleted successfully.");
    } catch (error) {
      showNotice("error", error.message || "Delete failed.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const exportRows = (rows, fileName) => {
    const exportData = rows.map((student) => ({ Name: student.name, Email: student.email, Age: student.age }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="hero">
          <div className="card">
            <h1 className="title">Students Table Dashboard</h1>
            <p className="subtitle">
              A polished full-stack assignment using React and Express with CRUD operations, validation,
              search, loading states, delete confirmation, and Excel export.
            </p>
            <div className="badge-row">
              <span className="badge">React Frontend</span>
              <span className="badge">Express Backend</span>
              <span className="badge">CRUD Operations</span>
              <span className="badge">Excel Download</span>
            </div>
          </div>

          <div className="card">
            <div className="stats">
              <div className="stat-box">
                <div className="stat-label">Total Students</div>
                <div className="stat-value">{students.length}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Filtered Results</div>
                <div className="stat-value">{filteredStudents.length}</div>
              </div>
            </div>
            {notice.message && <div className={`notice ${notice.type}`}>{notice.message}</div>}
          </div>
        </div>

        <div className="grid">
          <StudentForm onSubmit={handleAddOrUpdate} editingStudent={editingStudent} loading={formLoading} onCancelEdit={() => setEditingStudent(null)} />
          <StudentTable
            students={filteredStudents}
            loading={loading}
            onEdit={setEditingStudent}
            onDelete={setDeleteCandidate}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onExportFiltered={() => exportRows(filteredStudents, "filtered_students.xlsx")}
            onExportAll={() => exportRows(students, "all_students.xlsx")}
          />
        </div>

        <ConfirmModal
          open={Boolean(deleteCandidate)}
          title="Delete Student"
          message={deleteCandidate ? `Are you sure you want to delete ${deleteCandidate.name}?` : ""}
          onCancel={() => setDeleteCandidate(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      </div>
    </div>
  );
}
