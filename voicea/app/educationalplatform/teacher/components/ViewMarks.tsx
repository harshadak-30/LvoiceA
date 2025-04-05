"use client";

import { useEffect, useState } from "react";

export default function ViewMarks() {
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/get-marks")
      .then((res) => res.json())
      .then((data) => setMarks(data))
      .catch((error) => console.error("Error fetching marks:", error));
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Student Marks</h2>
      {marks.length === 0 ? (
        <p>No marks available.</p>
      ) : (
        <ul>
          {marks.map((mark: any, index) => (
            <li key={index} className="border p-3 mb-2 rounded">
              {mark.studentEmail} - Score: {mark.score}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
