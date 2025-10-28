import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import Leaderboard from "./Leaderboard";
import "./App.css";

const quizData = [
  { question: "If a box contains 15 red balls and 10 green balls, what is the ratio of red balls to the total number of balls in the box?", options: ["3:2", "2:3", "3:5", "5:3"], answer: "3:5" },
  { question: "The sum of two integers is (-15). If one of them is (-8), What is the other?", options: ["-23", "-7", "7", "23"], answer: "-7" },
  { question: "I am thinking of a number. If you double it and then add 10, the result is 50. What number am I thinking of?", options: ["5", "40", "10", "20"], answer: "20" },
  { question: "Bob adds three numbers. Afterward, he multiplies the same numbers and gets the same result. What are these numbers?", options: ["10,11,12", "1,2,3", "5,6,7", "2,3,4"], answer: "1,2,3" },
  { question: "If 3x=2x+12, what is x?", options: ["12", "7", "4.5", "6"], answer: "12" },
  { question: "3 workers finish a job in 12 days. In how many days will 6 workers finish it (same speed)?", options: ["24", "3", "6", "18"], answer: "6" },
  { question: "What operation does @ and * stands for? 45@5*10=90", options: ["*,*", "÷,-", "÷,*", "*,+"], answer: "÷,*" },
  { question: "0.25 * 0.4 =?", options: ["100", "1.0", "0.001", "0.1"], answer: "0.1" },
  { question: "Simplify:[{63-2(7+8)}-3]÷10", options: ["3", "91.2", "30", "3.7"], answer: "3" },
  { question: "Find the next two numbers in the sequence: 2, 6, 12, 20, 30, …", options: ["40,50", "42,56", "36,42", "50,60"], answer: "42,56" },
  { question: "The perimeter of a rectangle is 60 cm, and its length is twice its width. Find the dimensions:", options: ["20cm,30cm", "5cm,10cm", "10cm,20cm", "30cm,20cm"], answer: "10cm,20cm" },
  { question: "If a=7 and b=8, find the value of 2a-b", options: ["6", "9", "22", "14"], answer: "6" },
  { question: "Subtract 0.99 from 10", options: ["1.1", "9.91", "9.01", "10.99"], answer: "9.01" },
  { question: "4+(-4)+4+(-4)+ … If the number of terms is 60, then the value is:", options: ["-240", "-8", "0", "64"], answer: "0" },
  { question: "What is 999 + 876 + 1?", options: ["9877", "1876", "1789", "6769"], answer: "1876" },
  { question: "At what time does the digital clock show a palindrome?", options: ["45:00", "12:21", "22:00", "29:59"], answer: "12:21" },
  { question: "Find 50% of 360 without paper", options: ["180", "120", "720", "18"], answer: "180" },
  { question: "Find the missing number in the series: 3, 9, 27, ?, 243", options: ["120", "63", "81", "240"], answer: "81" },
  { question: "Two angles of a triangle are 35° and 65°. Find the third angle.", options: ["100°", "90°", "30°", "80°"], answer: "80°" },
  { question: "What is the sum of the first 10 natural numbers?", options: ["100", "200", "105", "55"], answer: "55" },
];

function App() {
  const [step, setStep] = useState("start");
  const [form, setForm] = useState({ name: "", class: "", section: "", grno: "", house: "" });
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [startTime, setStartTime] = useState(null);
  const [password, setPassword] = useState("");
  const [isHost, setIsHost] = useState(false);

  // Timer
  useEffect(() => {
    if (step === "quiz" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) handleNext();
  }, [timeLeft, step]);

  const handleStart = () => {
    if (!form.name || !form.class || !form.section || !form.grno || !form.house) {
      alert("Please fill all fields!");
      return;
    }
    setStep("quiz");
    setStartTime(Date.now());
    setTimeLeft(30);
  };

  const handleOptionSelect = (option) => {
    if (selected) return;
    setSelected(option);
    const timeTaken = (Date.now() - startTime) / 1000;
    let points = 0;
    if (timeTaken <= 10) points = 20;
    else if (timeTaken <= 20) points = 15;
    else points = 10;

    if (option === quizData[index].answer) setScore(score + points);
  };

  const handleNext = async () => {
    if (index + 1 < quizData.length) {
      setIndex(index + 1);
      setSelected(null);
      setTimeLeft(30);
      setStartTime(Date.now());
    } else {
      await addDoc(collection(db, "results"), { ...form, score, timestamp: new Date() });
      setStep("end");
    }
  };

  const handleHostLogin = () => {
    if (password === "@MathsDepartment1729") {
      setIsHost(true);
      setStep("leaderboard");
    } else alert("Incorrect password!");
  };

  if (step === "start")
    return (
      <div className="start-container">
        <div className="card">
          <h1 className="title">🏫 Mental Maths Quiz</h1>
          <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Class" onChange={(e) => setForm({ ...form, class: e.target.value })} />
          <input placeholder="Section" onChange={(e) => setForm({ ...form, section: e.target.value })} />
          <input placeholder="GR No" onChange={(e) => setForm({ ...form, grno: e.target.value })} />
          <input placeholder="House" onChange={(e) => setForm({ ...form, house: e.target.value })} />
          <button className="start-btn" onClick={handleStart}>Start Quiz</button>

          <div className="host-login">
            <input type="password" placeholder="Host Password" onChange={(e) => setPassword(e.target.value)} />
            <button className="host-btn" onClick={handleHostLogin}>Host Login</button>
          </div>
        </div>
      </div>
    );

  if (step === "quiz") {
    const q = quizData[index];
    return (
      <div className="quiz-container">
        <div className="timer-bar" style={{ width: `${(timeLeft / 30) * 100}%` }} />
        <div className="quiz-card">
          <h3>Question {index + 1}/{quizData.length}</h3>
          <h2>{q.question}</h2>
          <div className="options">
            {q.options.map((opt) => (
              <button
                key={opt}
                className={`option-btn ${
                  selected
                    ? opt === q.answer
                      ? "correct"
                      : opt === selected
                      ? "wrong"
                      : ""
                    : ""
                }`}
                onClick={() => handleOptionSelect(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
          {selected && (
            <button className="next-btn" onClick={handleNext}>
              Next
            </button>
          )}
        </div>
      </div>
    );
  }

  if (step === "end")
    return (
      <div className="end-container">
        <div className="card">
          <h2>🎉 Quiz Completed!</h2>
          <p>Your Final Score: <b>{score}</b></p>
        </div>
      </div>
    );

  if (step === "leaderboard" && isHost) return <Leaderboard />;
}

export default App;