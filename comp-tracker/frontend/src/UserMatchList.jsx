import { useState, useEffect } from 'react'

import { useParams, useNavigate } from 'react-router-dom';

import RatingGraph from './RatingGraph';

function UserMatchList(){

    const navigate = useNavigate();

    const { userID } = useParams();

    const [userMatchList, setUserMatchList] = useState([]);

    const [user, setUser] = useState({});


    const fetchUser = async () => {
        try {
            const response = await fetch(`/users/${userID}`);
            if (!response.ok){
                throw new Error(`Server responded with status: ${response.status}`)
            }
            const userJson = await response.json();
            console.log(userJson);
            setUser(userJson);


        } catch (error) {
            console.error('Error fetching data:', error);
            setUser({}) ;
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUserMatches = async () => {
        try {
            const response = await fetch(`/matches/all/${userID}`);
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
     
    }, []);


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
                    
            <button onClick={() => navigate(`/`)}>Back</button>

            <RatingGraph user={user} userMatchList={userMatchList}/>
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

export default UserMatchList