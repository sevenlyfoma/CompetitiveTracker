import { useState, useEffect } from 'react'

function UserMatchList({user}){

    const [userMatchList, setUserMatchList] = useState([]);

    const fetchUserMatches = async () => {
        try {
            const response = await fetch(`matches/all/${user.id}`);
            if (!response.ok){
                throw new Error(`Server responded with status: ${response.status}`)
            }
            const matchListJson = await response.json();
            console.log(matchListJson);
            setUserMatchList(matchListJson);


        } catch (error) {
            console.error('Error fetching data:', error);
            setUserMatchList([]); 
        }
        
    }

    
    useEffect(() => {
        fetchUserMatches();
    }, [user]);


    return (
        <>
            <h2>
                Match History for User: {user.name}
            </h2>

            <table>
                <thead>
                    <tr>
                        <th>Date of Match</th>
                        <th>Opponent</th>
                        <th>Match Result</th>
                        <th>Rating Change</th>
                    </tr>
                </thead>

                <tbody>
                    {userMatchList
                    .slice() 
                    .sort((a, b) => a.id - b.id)
                    .map((match) => {
                        return (
                            <UserMatchRow key={match.id} match={match} user={user}/>
                        )
                    })}
                </tbody>


            </table>

        </>
    ) 
}

function UserMatchRow({match, user}){

    let matchResult;
    if (match.winner.id === user.id) {
        matchResult = "win";
    } else {
        matchResult = "loss";
    }

    let ratingChange = match.user1RatingAfter - match.user1RatingBefore

    let opponent;
    if (match.user1.id == user.id){
        opponent = match.user2.name;
    }
    else{
        opponent = match.user1.name;
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

export default UserMatchList