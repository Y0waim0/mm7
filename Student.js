import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, doc, setDoc, updateDoc, onSnapshot, getDoc, Timestamp } from "firebase/firestore";

const questions = [
  { q: "5 + 3 = ?", options: ["6","7","8","9"], answer: "8" },
  { q: "12 - 7 = ?", options: ["3","5","6","4"], answer: "5" },
  // ... add 20 questions
];

export default function Student() {
  const [name, setName] = useState("");
  const [gr, setGr] = useState("");
  const [cls, setCls] = useState("");
  const [joined, setJoined] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);

  const studentRef = doc(db, "quizzes/quiz1/students", gr);
  const quizRef = doc(db, "quizzes", "quiz1");

  useEffect(() => {
    if(joined){
      const unsub = onSnapshot(quizRef, snapshot => {
        const data = snapshot.data();
        setCurrentQ(data.currentQuestion);
        const elapsed = Math.floor((Date.now()/1000) - data.questionStart.seconds);
        setTimeLeft(Math.max(0, 30 - elapsed));
      });
      return () => unsub();
    }
  }, [joined]);

  const joinQuiz = async () => {
    await setDoc(studentRef, { name, gr_no: gr, class_sec: cls, score: 0, answer: "" });
    setJoined(true);
  };

  const submitAnswer = async () => {
    const q = questions[currentQ];
    const quizSnap = await getDoc(quizRef);
    const elapsed = Math.floor((Date.now()/1000) - quizSnap.data().questionStart.seconds);
    let points = 0;
    if(selected === q.answer){
      if(elapsed <= 10) points = 20;
      else if(elapsed <= 20) points = 10;
      else points = 8;
    }
    await updateDoc(studentRef, { score: points, answer: selected });
  };

  if(!joined){
    return (
      <div style={{padding:20}}>
        <h1>Join Quiz</h1>
        <input placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} /><br/>
        <input placeholder="GR Number" value={gr} onChange={e=>setGr(e.target.value)} /><br/>
        <input placeholder="Class / Section" value={cls} onChange={e=>setCls(e.target.value)} /><br/>
        <button onClick={joinQuiz}>Join</button>
      </div>
    )
  }

  const q = questions[currentQ];

  return (
    <div style={{padding:20}}>
      <h2>Question {currentQ + 1}</h2>
      <p>{q.q}</p>
      {q.options.map(opt => (
        <div key={opt}>
          <input type="radio" name="opt" value={opt} checked={selected===opt} onChange={()=>setSelected(opt)} /> {opt}
        </div>
      ))}
      <p>⏳ Time Left: {timeLeft}s</p>
      <button onClick={submitAnswer} disabled={timeLeft===0}>Submit</button>
    </div>
  )
}
