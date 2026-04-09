import React, {useCallback, useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function TournamentMatchPage() {

    const { tournamentID = -1, tournamentMatchID = -1 } = useParams();

    const [tMatch, setTMatch] = useState({});

    const [tournament, setTournament] = useState({})

    const navigate = useNavigate();


    const fetchData= async () => {
        try {
            const response = await fetch(`/api/tournament_matches/${tournamentMatchID}`);
            if (!response.ok){
                throw new Error(`Server responded with status: ${response.status}`)
            }
            const tMatchJson = await response.json();
            console.log(tMatchJson);
            setTMatch(tMatchJson);

            const response2 = await fetch(`/api/tournaments/${tournamentID}`);
            if (!response2.ok){
                throw new Error(`Server responded with status: ${response2.status}`)
            }
            const tournamentJson = await response2.json();
            console.log(tournamentJson);
            setTournament(tournamentJson);


        } catch (error) {
            console.error('Error fetching data:', error);
            setTMatch({}) ;
            setTournament({});
        }
    }

    useEffect(() => {
        fetchData();
    }, []);
  

    return (
        <>
        <h1>{tournament?.tournamentName}</h1>
        <MatchTitle tMatch={tMatch}/>
        <MatchBody tMatch={tMatch} fetchData={fetchData}/>
        <button onClick={() => navigate(`/tournaments/closed/${tournament.id}`)}>Back</button>
        </>
    )
      

}


function MatchTitle({tMatch}){
    let defaultMsg = "(Participant Yet to be Confirmed)";
    let player1 = tMatch?.user1 == null ? defaultMsg : tMatch?.user1?.name
    let player2 = tMatch?.user2 == null ? defaultMsg : tMatch?.user2?.name
    return (
        <>
            <h2>{tMatch?.matchTitle}: {player1} vs {player2}</h2>
        </>
            
    )
}

function MatchBody({tMatch, fetchData}){

    if (tMatch?.user1 == null || tMatch?.user2 == null) {
        return <p>No details to be displayed</p>
    }
    else if (tMatch.matchRecord == null){
        return (<UnfinalisedMatchBody tMatch={tMatch} fetchData={fetchData}/>)
    }
    else{
        return (<FinalisedMatchBody tMatch={tMatch} />)
    }

}

function FinalisedMatchBody({tMatch}){

    let winner = tMatch?.user2?.name;;
    let loser = tMatch?.user1?.name;
    if (tMatch?.user1?.id == tMatch?.matchRecord?.winner?.id){
        winner = tMatch?.user1?.name;
        loser = tMatch?.user2?.name;
    }

    return (
        <>
        <h3>Match Result: </h3>
        <h3>Winner: {winner}</h3>
        <h4>Rating change:</h4>
        <p>{tMatch?.matchRecord?.user1?.name}: {tMatch?.matchRecord?.user1RatingBefore} -{'>'} {tMatch?.matchRecord?.user1RatingAfter}</p>
        <p>{tMatch?.matchRecord?.user2?.name}: {tMatch?.matchRecord?.user2RatingBefore} -{'>'} {tMatch?.matchRecord?.user2RatingAfter}</p>
        </>
    )
}



function UnfinalisedMatchBody({tMatch, fetchData}){

    const [result, setResult] = useState({winnerID: tMatch?.user1?.id, loserID:  tMatch?.user2?.id,});

    useEffect(() => {
    console.log("Updated Result State:", result);
    }, [result]);

    function handleChange(e) {
        const {value} = e.target;
        let winner = -1
        let loser = -1

        if (value === "user1"){
            winner = tMatch?.user1?.id;
            loser = tMatch?.user2?.id;
        }
        if (value === "user2"){
            winner = tMatch?.user2?.id;
            loser = tMatch?.user1?.id;
        }

        setResult((prevResult) => ({
            ...prevResult,
            winnerID: winner,
            loserID: loser,
        }));
    }
  


    return (
        <>
            <label>Winner:</label>
            <select 
                value={result.winnerID === tMatch?.user1?.id ? "user1" : "user2"}
                onChange={handleChange}
                >
                <option value="user1">{tMatch?.user1?.name}</option>
                <option value="user2">{tMatch?.user2?.name}</option>
            </select>

            <SendResultButton tmid={tMatch?.id} result={result} fetchData={fetchData}/>
        
        </>
    )
}

function SendResultButton({tmid, result, fetchData}){

    console.log("sendresultbutton")
    console.log(tmid);


    const handleCreate = async () => {
        if (!window.confirm("Are you sure the winner has been correctly selected")) return;
        try {
        const response = await fetch(`/api/tournament_matches/report/${tmid}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(result)
        });

        if (!response.ok) {
            throw new Error('Failed to Send Match results');
        }

        fetchData();


        } catch (error) {
        console.error("Error Sending Match results:", error);
        }
    };

  
  return (
    <>
      <button className='SendResultButton' onClick={handleCreate} style={{ color: 'green' }}>
        Send Result
      </button>
    </>
  )
}

export default TournamentMatchPage