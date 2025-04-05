import { useState, useEffect } from "react";

const StudentQuiz = () => {
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<string[]>(Array(3).fill(""));
    const [isListening, setIsListening] = useState(false);
    let recognition: any = null;

    const staticQuiz = {
        title: "General Knowledge Quiz",
        questions: [
            {
                question: "What is the capital of France?",
                options: ["Paris", "London", "Berlin", "Madrid"],
                answer: "Paris",
            },
            {
                question: "Who wrote 'Hamlet'?",
                options: ["Shakespeare", "Dickens", "Hemingway", "Austen"],
                answer: "Shakespeare",
            },
            {
                question: "What is 5 multiplied by 6?",
                options: ["30", "25", "20", "35"],
                answer: "30",
            }
        ]
    };

    const askQuestion = (index: number) => {
        const { question, options } = staticQuiz.questions[index];
        const utterance = new SpeechSynthesisUtterance(
            `${question}. The options are: ${options.join(", ")}. Please say your answer.`
        );
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        if (isQuizStarted) askQuestion(currentQuestionIndex);
    }, [currentQuestionIndex, isQuizStarted]);

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Your browser does not support speech recognition.");
            return;
        }

        recognition = new window.webkitSpeechRecognition();
        recognition.lang = "en-US";
        recognition.start();
        setIsListening(true);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const normalizedTranscript = transcript.trim().toLowerCase().replace(/[^\w\s]/gi, ""); // Remove punctuation
            const newAnswers = [...answers];
            newAnswers[currentQuestionIndex] = normalizedTranscript;
            setAnswers(newAnswers);
            setIsListening(false);
        };

        recognition.onerror = () => {
            setIsListening(false);
            alert("Error recognizing speech. Please try again.");
        };
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < staticQuiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            submitQuiz();
        }
    };

    const submitQuiz = () => {
        let score = 0;
        staticQuiz.questions.forEach((q, i) => {
            const userAnswer = answers[i].toLowerCase().trim();
            const correctAnswer = q.answer.toLowerCase().trim();

            console.log(`User Answer: "${userAnswer}", Correct Answer: "${correctAnswer}"`);

            if (userAnswer === correctAnswer) {
                score += 1;
            }
        });

        const utterance = new SpeechSynthesisUtterance(
            `Your quiz is complete. Your score is ${score} out of ${staticQuiz.questions.length}`
        );
        window.speechSynthesis.speak(utterance);

        alert(`Your score: ${score}/${staticQuiz.questions.length}`);
        resetQuiz(); // Reset quiz after submission
    };

    const resetQuiz = () => {
        setIsQuizStarted(false);
        setCurrentQuestionIndex(0);
        setAnswers(Array(3).fill(""));
        window.speechSynthesis.cancel();
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-green-500 p-6">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">{staticQuiz.title}</h1>

                {!isQuizStarted ? (
                    <button
                        className="px-6 py-3 bg-green-500 text-white text-lg font-bold rounded-lg hover:bg-green-600 transition-all mb-6"
                        onClick={() => setIsQuizStarted(true)}
                    >
                        🎤 Start Quiz
                    </button>
                ) : null}

                {isQuizStarted && (
                    <>
                        <div className="mb-6">
                            <p className="text-lg text-gray-700 font-semibold mb-4">
                                {staticQuiz.questions[currentQuestionIndex].question}
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                {staticQuiz.questions[currentQuestionIndex].options.map((option, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 bg-blue-100 rounded-lg text-gray-700 font-medium cursor-pointer hover:bg-blue-200 transition-all"
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <button
                                className={`px-6 py-3 text-white rounded-lg font-semibold ${
                                    isListening ? 'bg-red-500' : 'bg-blue-500'
                                } hover:bg-blue-600 transition-all`}
                                onClick={startListening}
                            >
                                🎤 {isListening ? "Listening..." : "Speak Your Answer"}
                            </button>
                        </div>

                        {answers[currentQuestionIndex] && (
                            <div className="mb-6">
                                <p className="text-gray-700 font-medium">
                                    Your Answer: <span className="text-green-600">{answers[currentQuestionIndex]}</span>
                                </p>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <button
                                className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
                                onClick={resetQuiz}
                            >
                                ❌ Close
                            </button>
                            <button
                                className="px-6 py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-all"
                                onClick={nextQuestion}
                            >
                                {currentQuestionIndex === staticQuiz.questions.length - 1 ? "Submit Quiz" : "Next Question ⏭️"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StudentQuiz;