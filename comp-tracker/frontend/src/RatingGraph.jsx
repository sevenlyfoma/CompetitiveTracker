import { useState, useEffect } from 'react'

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
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({userMatchList}) => {
  const data = {
    labels: ['', '', '', '',],
    datasets: [
      {
        label: 'Rating',
        data: [980, 1000, 980, 1000],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Rating Change',
      },
    },
  };

  return <Line options={options} data={data} />;
};


function RatingGraph({userMatchList}){

    return (
        <>
            <LineChart userMatchList={userMatchList}/>
        </>
    )
}

export default RatingGraph