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

const LineChart = ({user, userMatchList}) => {

  let ratings;

  if (user.id = userMatchList[0]?.user1.id) {
    ratings = [ userMatchList[0]?.user1RatingBefore, ...userMatchList.map(match => match.user1RatingAfter)];
  }
  else {
    ratings = [ userMatchList[0]?.user2RatingBefore, ...userMatchList.map(match => match.user2RatingAfter)];
  }

  
  const labels = ratings.map(x => '')
  
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Rating',
        data: ratings,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(8, 14, 14, 0.5)',
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


function RatingGraph({user, userMatchList}){

    return (
        <>
            <LineChart user={user} userMatchList={userMatchList}/>
        </>
    )
}

export default RatingGraph