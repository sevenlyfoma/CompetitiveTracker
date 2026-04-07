import { useState, useEffect } from 'react'
import './MatchList.css'

function MatchList(){
    const [matchList, setMatchList] = useState([]);

    const fetchMatches = async () => {
        try {
            const response = await fetch("api/matches/all");
            if (!response.ok){
                throw new Error(`Server responded with status: ${response.status}`)
            }
            const matchListJson = await response.json();
            console.log(matchListJson);
            setMatchList(matchListJson);


        } catch (error) {
            console.error('Error fetching data:', error);
            setMatchList([]); 
        }
        
    }

    
    useEffect(() => {
        fetchMatches();
    }, []);

    return (
        <>
        <h2>Match List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Match ID</th>
                        <th>Date of Match</th>
                        <th>User 1</th>
                        <th>User 2</th>
                        <th>Winner</th>
                        <th>User 1 Rating Before</th>
                        <th>User 2 Rating Before</th>
                        <th>User 1 Rating After</th>
                        <th>User 2 Rating After</th>
                    </tr>
                </thead>

                <tbody>
                    {matchList
                    .slice() 
                    .sort((a, b) => a.id - b.id)
                    .map((match) => {
                        return (
                            <MatchRow key={match.id} match={match}/>
                        )
                    })}
                </tbody>


            </table>
        
        </>
    )
}

function MatchRow({match}){
return (
    <tr>
      <td>{match.id}</td>
      <td>{match.dateOfMatch}</td>
      <td>{match.user1.name}</td>
      <td>{match.user2.name}</td>
      <td>{match.winner.name}</td>
      <td>{match.user1RatingBefore}</td>
      <td>{match.user2RatingBefore}</td>
      <td>{match.user1RatingAfter}</td>
      <td>{match.user2RatingAfter}</td>

    </tr>
  )
}

export default MatchList