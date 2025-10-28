import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, doc, setDoc, getDoc, updateDoc, onSnapshot, Timestamp } from "firebase/firestore";

const questions = [
  { q: "5 + 3 = ?", options: ["6","7","8","9"], answer: "8" },
  { q: "12 - 7 = ?", options: ["3","5","6","4"], answer: "5" },
  // ... add 20 questions
];

export default function Host() {
  const [currentQ, setCurrentQ] = useState(0);
  const [students, setStudents] = useState([]);

  const quizRef = doc(db, "quizzes", "quiz1");

  useEffect(() => {
    // Real-time listener for students collection
    const unsub = onSnapshot(collection(db, "quizzes/quiz1/students"), snapshot => {
      const stu = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setStudents(stu);
    });
    return () => unsub();
  }, []);

  const startQuiz = async () => {
    await setDoc(quizRef, { currentQuestion: 0, questionStart: Timestamp.now() });
    setCurrentQ(0);
  };

  const nextQuestion = async () => {
    const nextQ = currentQ + 1;
    setCurrentQ(nextQ);
    await updateDoc(quizRef, { currentQuestion: nextQ, questionStart: Timestamp.now() });
  };

  return (
    <div style={{padding: 20}}>
      <h1>Host Dashboard</h1>
      <button onClick={startQuiz}>Start Quiz</button>
      <h2>Current Question: {currentQ + 1}</h2>
      <button onClick={nextQuestion}>Next Question</button>
      <h2>Leaderboard</h2>
      <ol>
        {students.sort((a,b)=>b.score - a.score).map(stu => (
          <li key={stu.id}>{stu.name} - {stu.score} pts</li>
        ))}
      </ol>
    </div>
  );
}
