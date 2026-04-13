import { useState, useEffect } from 'react'

import { useParams, useNavigate, data } from 'react-router-dom';

import Select from 'react-select'

import toast from 'react-hot-toast';


//TODO look at warnings closely like this  2026-03-14T15:44:15.333Z  WARN 22351 --- [comp-tracker] [nio-8080-exec-5] .w.s.m.s.DefaultHandlerExceptionResolver : Resolved [org.springframework.web.method.annotation.MethodArgumentTypeMismatchException: Method parameter 'id': Failed to convert value of type 'java.lang.String' to required type 'java.lang.Long'; For input string: "{"id":2,"tournamentName":"extourney2","closed":true}"]

function TournamentEntrantList(){

    
    const { tournamentID } = useParams();
    

    const navigate = useNavigate();

    const [tournamentEntrantList, setTournamentEntrantList] = useState([]);
    const [tournament, setTournament] = useState({})

    const fetchEntrants = async () => {
        try {
            const response = await fetch(`/api/tournament_entrants/${tournamentID}`);
            const data = await response.json();
            if (!response.ok){
                throw new Error(data.message);
            }
            const entrantsJson = data;
            console.log(entrantsJson);
            setTournamentEntrantList(entrantsJson);

            const response2 = await fetch(`/api/tournaments/${tournamentID}`);
            const data2 = await response2.json();
            if (!response2.ok){
                throw new Error(data2.message)
            }
            const tournamentJson = data2;
            console.log(tournamentJson);
            setTournament(tournamentJson);


        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Error fetching data: ' + error.message);
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
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
        const userListJson = data;
        console.log(userListJson);
        setUserList(userListJson);

        } catch (error) {
        toast.error('Error fetching data: ', error.message);
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
                Entrants for Tournament: {tournament?.tournamentName}
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

                    <AddEntrantRow key={"Add Entrant Row"} userList={userList} tournament={tournament} onCreate={fetchEntrants}/>
                </tbody>


            </table>

            <CloseTournamentButton tournament={tournament} onClose={() => navigate(`/tournaments/closed/${tournament.id}`)}/>
                    
            <button onClick={() => navigate(`/tournaments`)}>Back</button>

        </>
    ) 
}

function CloseTournamentButton({tournament, onClose}){
    const handleClose = async () => {
        if (!window.confirm("Are you sure you want to close the tournament")) return;

        try {
            const response = await fetch(`/api/tournaments/close/${tournament.id}`, {
                method: 'PUT',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            onClose();

        } catch (error) {
            console.error("Error closing tournament:", error.message);
            toast.error("Error closing tournament: " + error.message)
        }
    };

  
  return (
    <>
      <button className='CloseButton' onClick={handleClose} style={{ color: 'blue' }}>
        Close Tournament
      </button>
    </>
  )

}

function AddUserButton({user, tournament, onCreate}){
    const entrant_object = {user: user, tournament:tournament}

    const handleCreate = async () => {
        if (!window.confirm("Are you sure the data is correct")) return;

        try {
        const response = await fetch(`/api/tournament_entrants/${tournament.id}/${user.id}`, {
            method: 'PUT',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        onCreate();
        console.log(`Entrant added successfully`);
        } catch (error) {
            toast.error("Error adding entrant:", error.message)
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
      const response = await fetch(`/api/tournament_entrants/${entrant.tournament.id}/${entrant.user.id}`, {
        method: 'DELETE',
      });

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message);
      }

      console.log(`Entrant deleted successfully`);
      onDelete();
    } catch (error) {
        toast.error("Error deleting entrant: " + data.message);
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