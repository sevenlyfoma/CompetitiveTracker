import { useState, useEffect } from 'react'

import { useParams, useNavigate } from 'react-router-dom';

import Select from 'react-select'


//TODO look at warnings closely like this  2026-03-14T15:44:15.333Z  WARN 22351 --- [comp-tracker] [nio-8080-exec-5] .w.s.m.s.DefaultHandlerExceptionResolver : Resolved [org.springframework.web.method.annotation.MethodArgumentTypeMismatchException: Method parameter 'id': Failed to convert value of type 'java.lang.String' to required type 'java.lang.Long'; For input string: "{"id":2,"tournamentName":"extourney2","closed":true}"]

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

    const [userList, setUserList] = useState([]);

    const fetchUsers = async () => {
        try {
        const response = await fetch("/api/users/all");
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        const userListJson = await response.json();
        console.log(userListJson);
        setUserList(userListJson);

        } catch (error) {
        console.error('Error fetching data:', error);
        setUserList([]); 
        }
    
    };

    useEffect(() => {
        fetchUsers();
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
                            <EntrantRow key={item.user.id} entrant={item} onDelete={fetchEntrants}/>
                        )
                    })}

                    <AddEntrantRow key={"Add Entrant Row"} userList={userList} tournament={tournament_json} onCreate={fetchEntrants}/>
                </tbody>


            </table>
                    
            <button onClick={() => navigate(`/tournaments`)}>Back</button>

        </>
    ) 
}

function AddUserButton({user, tournament, onCreate}){
    const entrant_object = {user: user, tournament:tournament}

    const handleCreate = async () => {
        if (!window.confirm("Are you sure the data is correct")) return;

        try {
        const response = await fetch(`/api/tournament_entrants`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(entrant_object)
        });

        if (!response.ok) {
            throw new Error('Failed to add entrant');
        }

        onCreate();
        console.log(`Entrant added successfully`);
        } catch (error) {
        console.error("Error adding entrant:", error);
        }
    };

  
  return (
    <>
      <button className='ChangeButton' onClick={handleCreate} style={{ color: 'green' }}>
        Add Entrant
      </button>
    </>
  )

}

function AddEntrantRow({userList, tournament, onCreate}){
    const search_filter = (option, searchText) => {return (option.data.name.toLowerCase().includes(searchText.toLowerCase()))}

    const [user, setUser] = useState(null);


    return (
        <tr>
            <td><Select onChange={(option) => setUser(option)} filterOption={search_filter} options={userList} getOptionLabel={option =>`${option.name} id:${option.id}`}/></td>
            <td><AddUserButton user={user} tournament={tournament} onCreate={onCreate}/></td>
        </tr>
    )
}

function EntrantRow({entrant, onDelete}){
    return (
        <tr>
        <td>{entrant.user.name}</td>
        <td><EntrantDeleteButton entrant={entrant} onDelete={onDelete}/></td>
        </tr>
    )
}

function EntrantDeleteButton({entrant, onDelete}) {

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this entrant?")) return;

    try {
      const response = await fetch(`/api/tournament_entrants`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entrant)
      });

      if (!response.ok) {
        throw new Error('Failed to delete entrant');
      }

      console.log(`Entrant deleted successfully`);
      onDelete();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  
  return (
    <>
      <button className='ChangeButton' onClick={handleDelete} style={{ color: 'red' }}>
        Delete Entrant
      </button>
    </>
  )
}

export default TournamentEntrantList