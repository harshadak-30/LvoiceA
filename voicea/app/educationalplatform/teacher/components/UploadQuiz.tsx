import { useState } from "react";

const TeacherUploadQuiz = () => {
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState([{ question: "", options: ["", "", "", ""], answer: "" }]);
    const [isPublished, setIsPublished] = useState(false);

    const handleQuestionChange = (index: number, field: string, value: string) => {
        const updatedQuestions = [...questions];
        if (field === "question" || field === "answer") {
            updatedQuestions[index][field] = value;
        } else {
            updatedQuestions[index].options[parseInt(field)] = value;
        }
        setQuestions(updatedQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { question: "", options: ["", "", "", ""], answer: "" }]);
    };

    const uploadQuiz = async () => {
        const response = await fetch("/api/upload-quiz", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, questions }),
        });
        const data = await response.json();
        alert(data.message);
    };

    const publishQuizForStudents = async () => {
        alert("Publishing quiz... Please wait."); // Alert before publishing
        const response = await fetch("/api/publish-quiz", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title }),
        });
        const data = await response.json();
        if (data.success) {
            setIsPublished(true);
            alert("Quiz published successfully for students!");
        } else {
            alert("Failed to publish quiz.");
        }
    };
    
    return (
        <div>
            <h2>Upload Quiz</h2>
            <input type="text" placeholder="Quiz Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            {questions.map((q, index) => (
                <div key={index}>
                    <input type="text" placeholder="Question" value={q.question} onChange={(e) => handleQuestionChange(index, "question", e.target.value)} />
                    {q.options.map((opt, i) => (
                        <input key={i} type="text" placeholder={`Option ${i + 1}`} value={opt} onChange={(e) => handleQuestionChange(index, i.toString(), e.target.value)} />
                    ))}
                    <input type="text" placeholder="Correct Answer" value={q.answer} onChange={(e) => handleQuestionChange(index, "answer", e.target.value)} />
                </div>
            ))}
            <button onClick={addQuestion}>Add Question</button>
            <button onClick={uploadQuiz}>Upload Quiz</button>
            <button onClick={publishQuizForStudents} disabled={isPublished} style={{ backgroundColor: isPublished ? "gray" : "blue", color: "white" }}>
                {isPublished ? "Quiz Published" : "Publish for Students"}
            </button>
        </div>
    );
};

export default TeacherUploadQuiz;
