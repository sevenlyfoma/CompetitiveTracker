import React, {useCallback, useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function TournamentMatchPage() {

    const { tournamentID = -1, tournamentMatchID = -1 } = useParams();

    const [tMatch, setTMatch] = useState({});


    const fetchTMatch = async () => {
        try {
            const response = await fetch(`/api/tournament_matches/${tournamentMatchID}`);
            if (!response.ok){
                throw new Error(`Server responded with status: ${response.status}`)
            }
            const tMatchJson = await response.json();
            console.log(tMatchJson);
            setTMatch(tMatchJson);


        } catch (error) {
            console.error('Error fetching data:', error);
            setTMatch({}) ;
        }
    }

    useEffect(() => {
        fetchTMatch();
    }, []);
  

    return (
        <h1>Match Page "{tournamentMatchID}"</h1>
    )
      

}



export default TournamentMatchPage