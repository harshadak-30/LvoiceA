"use client";

import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

export default function ViewAssignments() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/assignments/all")
      .then((res) => res.json())
      .then((data) => setAssignments(data.assignments))
      .catch((error) => console.error("❌ Error fetching assignments:", error));
  }, []);

  const downloadPDF = (text, studentEmail) => {
    const doc = new jsPDF();
    doc.text(`Student: ${studentEmail}\n\n${text}`, 10, 10);
    doc.save(`assignment-${studentEmail}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-5">
      <h1 className="text-3xl font-bold mb-4">📄 View Student Assignments</h1>

      {assignments.length === 0 ? (
        <p>No assignments found.</p>
      ) : (
        <div className="w-full max-w-3xl space-y-4">
          {assignments.map((assignment, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold">👤 {assignment.studentEmail}</h2>
              <p className="mt-2 text-gray-300">{assignment.text}</p>

              <button onClick={() => downloadPDF(assignment.text, assignment.studentEmail)} className="mt-2 px-4 py-2 bg-yellow-500 text-black rounded-lg">
                📥 Download PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
