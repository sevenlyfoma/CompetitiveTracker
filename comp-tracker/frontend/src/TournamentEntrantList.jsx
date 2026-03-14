import { useState, useEffect } from 'react'

import { useParams, useNavigate } from 'react-router-dom';

function TournamentEntrantList(){

    
    const { tournament } = useParams();
    

    const tournament_json = JSON.parse(tournament)

    const navigate = useNavigate();

    const [tournamentEntrantList, setTournamentEntrantList] = useState([]);

    const fetchEntrants = async () => {
        try {
            const response = await fetch(`/api/tournament_entrants/${tournament_json.id}`);
            if (!response.ok){
                throw new Error(`Server responded with status: ${response.status}`)
            }
            const entrantsJson = await response.json();
            console.log(entrantsJson);
            setTournamentEntrantList(entrantsJson);


        } catch (error) {
            console.error('Error fetching data:', error);
            setUser({}) ;
        }
    }

    useEffect(() => {
        fetchEntrants();
    }, []);


    return (
        <>
            <h2>
                Entrants for Tournament: {tournament_json.name}
            </h2>

            <table>
                <thead>
                    <tr>
                        <th>Player</th>
                        <th></th>

                    </tr>
                </thead>

                <tbody>
                    {tournamentEntrantList
                    .map((item) => {
                        return (
                            <EntrantRow key={item.user.id} entrant={item.user} />
                        )
                    })}
                </tbody>


            </table>
                    
            <button onClick={() => navigate(`/tournaments`)}>Back</button>

        </>
    ) 
}

function EntrantRow({entrant}){
    return (
        <tr>
        <td>{entrant.name}</td>
        <td></td>
        </tr>
    )
}

function UserMatchRow({match, user}){

    let matchResult;
    if (match.winner.id === user.id) {
        matchResult = "win";
    } else {
        matchResult = "loss";
    }

    let ratingChange;

    let opponent;
    if (match.user1.id == user.id){
        opponent = match.user2.name;
        ratingChange = match.user1RatingAfter - match.user1RatingBefore
    }
    else{
        opponent = match.user1.name;
        ratingChange = match.user2RatingAfter - match.user2RatingBefore
    }

    return (
        <tr>
        <td>{match.dateOfMatch}</td>
        <td>{opponent}</td>
        <td>{matchResult}</td>
        <td>{ratingChange}</td>
        </tr>
    )
}

export default TournamentEntrantList