import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Host from "./mental-maths-quiz/src/Host";
import Student from "./mental-maths-quiz/src/Student";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Student />} />
        <Route path="/host" element={<Host />} />
      </Routes>
    </Router>
  );
}

export default App;
