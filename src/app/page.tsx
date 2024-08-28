'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ROUNDS = 1000;

function playRPS() {
  const choices = ['rock', 'paper', 'scissors'];
  return choices[Math.floor(Math.random() * choices.length)];
}

function determineWinner(bot1Choice: string, bot2Choice: string) {
  if (bot1Choice === bot2Choice) return 'Tie';
  if (
    (bot1Choice === 'rock' && bot2Choice === 'scissors') ||
    (bot1Choice === 'paper' && bot2Choice === 'rock') ||
    (bot1Choice === 'scissors' && bot2Choice === 'paper')
  ) {
    return 'Bot 1';
  }
  return 'Bot 2';
}

export default function Home() {
  const [bot1Wins, setBot1Wins] = useState(0);
  const [bot2Wins, setBot2Wins] = useState(0);
  const [ties, setTies] = useState(0);
  const [bot1Data, setBot1Data] = useState<number[]>([]);
  const [bot2Data, setBot2Data] = useState<number[]>([]);
  const [currentRound, setCurrentRound] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentRound < ROUNDS) {
        const bot1Choice = playRPS();
        const bot2Choice = playRPS();
        const winner = determineWinner(bot1Choice, bot2Choice);

        setCurrentRound((prev) => prev + 1);

        if (winner === 'Bot 1') {
          setBot1Wins((prev) => prev + 1);
        } else if (winner === 'Bot 2') {
          setBot2Wins((prev) => prev + 1);
        } else {
          setTies((prev) => prev + 1);
        }

        setBot1Data((prev) => [...prev, bot1Wins + (winner === 'Bot 1' ? 1 : 0)]);
        setBot2Data((prev) => [...prev, bot2Wins + (winner === 'Bot 2' ? 1 : 0)]);
      } else {
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [currentRound, bot1Wins, bot2Wins]);

  const chartData = {
    labels: Array.from({ length: currentRound }, (_, i) => i + 1),
    datasets: [
      {
        label: 'Bot 1',
        data: bot1Data,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Bot 2',
        data: bot2Data,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Rock Paper Scissors Simulation Progress',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Rounds',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Wins',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Rock Paper Scissors Simulation</h1>
      <div style={{ height: '400px' }}>
        <Line options={options} data={chartData} />
      </div>
      <div style={{ marginTop: '20px' }}>
        <h2>Final Results after {currentRound} rounds:</h2>
        <p>Bot 1 wins: {bot1Wins}</p>
        <p>Bot 2 wins: {bot2Wins}</p>
        <p>Ties: {ties}</p>
      </div>
    </div>
  );
}