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

const LineChart = ({user, matches}) => {

    let ratings = [];

    for (let i = 0; i < matches.length; i++){
        let match = matches[i];
        let userResult = match.participants[1];

        if (match.participants[0].user.id === user.id){
            userResult = match.participants[0];
        }

        if (i == 0){
            ratings.push(userResult.ratingBefore);
        }
        ratings.push(userResult.ratingAfter)

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

    const title = `ELO change for ${user.name}` 

    const options = {
        responsive: true,
        plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: title,
        },
        },

    };

    return <Line options={options} data={data} />;
};


function MatchHistoryGraph({user, matches}){

    return (
        <>
            <LineChart user={user} matches={matches}/>
        </>
    )
}

export default MatchHistoryGraph