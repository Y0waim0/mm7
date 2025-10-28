import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Leaderboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const snapshot = await getDocs(collection(db, "results"));
      const results = snapshot.docs.map((doc) => doc.data());
      setData(results);
    };
    fetchResults();
  }, []);

  // Group by house → take top 2
  const houseGroups = {};
  data.forEach((item) => {
    if (!houseGroups[item.house]) houseGroups[item.house] = [];
    houseGroups[item.house].push(item);
  });

  Object.keys(houseGroups).forEach((house) => {
    houseGroups[house].sort((a, b) => b.score - a.score);
    houseGroups[house] = houseGroups[house].slice(0, 2);
  });

  const chartLabels = Object.keys(houseGroups).flatMap(house =>
    houseGroups[house].map(student => `${student.name} (${house})`)
  );
  const chartScores = Object.keys(houseGroups).flatMap(house =>
    houseGroups[house].map(student => student.score)
  );

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Scores",
        data: chartScores,
        backgroundColor: ["#FFD700", "#C0C0C0", "#CD7F32", "#4BC0C0", "#9966FF", "#FF6384"],
        borderColor: "#000",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="container">
      <h2>🏆 House-wise Top 2 Students</h2>
      <Bar data={chartData} />
    </div>
  );
}