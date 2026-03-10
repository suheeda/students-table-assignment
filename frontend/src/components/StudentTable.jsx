import React from "react";

export default function StudentTable({ students, loading, onEdit, onDelete, searchTerm, setSearchTerm, onExportFiltered, onExportAll }) {
  return (
    <div className="card">
      <div className="toolbar">
        <div>
          <h2 className="table-title">Students Table</h2>
          <span className="tag">Name • Email • Age • Actions</span>
        </div>
        <div className="inline-actions">
          <button className="btn btn-success" onClick={onExportFiltered}>Export Filtered Excel</button>
          <button className="btn btn-secondary" onClick={onExportAll}>Export Full Excel</button>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-wrap">
          <input className="input" type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <span className="tag">Filtered Results</span>
      </div>

      {loading ? (
        <div className="center-loading"><span className="loader loader-dark" /> Loading students...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Age</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {students.length > 0 ? students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.age}</td>
                  <td>
                    <div className="inline-actions">
                      <button className="btn btn-primary" onClick={() => onEdit(student)}>Edit</button>
                      <button className="btn btn-warning" onClick={() => onDelete(student)}>Delete</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td className="empty" colSpan="4">No students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
