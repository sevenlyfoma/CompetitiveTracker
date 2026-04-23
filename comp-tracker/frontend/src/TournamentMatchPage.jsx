import React, {useCallback, useState, useEffect} from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';

function hackFields(match){
    if (match === undefined || match === null){
        return null;
    }
    let sorted = match.parents;
    sorted = match.parents.sort((a, b) => {
        const numA = a.parentMatch?.matchNumber ?? 0;
        const numB = b.parentMatch?.matchNumber ?? 0;
        return numA - numB;
    });

    match.inheritsParentMatch1Winner = sorted[0].inheritsParentMatchWinner;
    match.inheritsParentMatch2Winner = sorted[1].inheritsParentMatchWinner;

    match.parentMatch1 = sorted[0].parentMatch;
    match.parentMatch2 = sorted[1].parentMatch;

    match.user1 = sorted[0].user;
    match.user2 = sorted[1].user;

    if (match.matchRecord != null && match.matchRecord != undefined){
        let participants = match.matchRecord.participants;

        match.matchRecord.user1 = participants[0].user;
        match.matchRecord.user1RatingBefore = participants[0].ratingBefore;
        match.matchRecord.user1RatingAfter = participants[0].ratingAfter;


        match.matchRecord.user2 = participants[1].user;
        match.matchRecord.user2RatingBefore = participants[1].ratingBefore;
        match.matchRecord.user2RatingAfter = participants[1].ratingAfter;

        if (participants[0].points == 1){
            match.matchRecord.winner = participants[0].user;
        }
        else {
            match.matchRecord.winner = participants[1].user;
        }



    }

    return match;
}

function TournamentMatchPage() {

    const { tournamentID = -1, tournamentMatchID = -1 } = useParams();

    const [tMatch, setTMatch] = useState({});

    const [tournament, setTournament] = useState({})

    const navigate = useNavigate();


    const fetchData= async () => {
        try {
            const response = await fetch(`/api/tournament_matches/${tournamentMatchID}`);
            const data = await response.json();
            if (!response.ok){
                throw new Error(data.message)
            }
            const tMatchJson = data;
            const hacked = hackFields(tMatchJson);
            console.log(hacked);
            setTMatch(hacked);

            const response2 = await fetch(`/api/tournaments/${tournamentID}`);
            const data2 = await response2.json();
            if (!response2.ok){
                throw new Error(data2.message)
            }
            const tournamentJson = data2;
            console.log(tournamentJson);
            setTournament(tournamentJson);


        } catch (error) {
            toast.error("Error fetching data: " + error.message)
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

    let hackedDTO = {userIds: [result.winnerID, result.loserID], points: [1,0]}

    console.log(hackedDTO);


    const handleCreate = async () => {
        if (!window.confirm("Are you sure the winner has been correctly selected")) return;
        try {
        const response = await fetch(`/api/tournament_matches/report/${tmid}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(hackedDTO)
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        fetchData();


        } catch (error) {
            toast.error("Error Sending Match results:" + error.message)
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