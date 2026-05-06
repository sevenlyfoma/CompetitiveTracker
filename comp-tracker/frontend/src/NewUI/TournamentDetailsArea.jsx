import { useState, useEffect } from 'react'

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Stack from '@mui/material/Stack';

import Typography from '@mui/material/Typography';

import Pagination from '@mui/material/Pagination';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import {fetchData, sendData} from '../helpers/Fetcher';

import MatchHistoryGraph from './MatchHistoryGraph';

import { Autocomplete } from '@mui/material';
import {TextField} from '@mui/material';

import toast from 'react-hot-toast';



function TournamentNotSelectedArea({message}){
    return (
        <Box sx={{ display: 'flex', bgcolor: 'white', width: '100%', height:'100%',justifyContent: 'center', alignItems: 'center'}} >
            <Typography variant="h6" color="text.secondary">
                {message}
            </Typography>
        </Box>
    );
}

function EntrantTable({selectedTournament, entrants, selectedUser, setSelectedUser}){

    return (
        <TableContainer component={Paper}  sx={{maxWidth: 240, minWidth: 240, height: '100%',overflowY: 'auto', direction: 'rtl',}}>
        <Table stickyHeader sx={{ maxWidth: 240, direction: 'ltr' }} aria-label="Tournament Table">
            <TableHead>
            <TableRow>
                <TableCell>Entrant</TableCell>
                <TableCell align="right">Elo</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {entrants.map((entrant, index) => (
                <TableRow
                key={entrant.user.id}


                onClick={() => setSelectedUser(entrant.user)}
                hover
                selected={selectedUser.id === entrant.user.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                <TableCell component="th" scope="row">
                    {entrant.user.name}
                </TableCell>
                <TableCell align="right">{entrant.user.rating}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>


    )
}

function AddUserArea({selectedTournament, fetchEntrants}){

    const [addedUser, setAddedUser] = useState({});

    const [searchResultUsers, setSearchResultUsers] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");


    useEffect(() => {if (searchTerm !== "") {fetchData(`/api/users/search/${debouncedSearch}`, setSearchResultUsers);}}, [debouncedSearch]);

    useEffect(() => {
        const timer = setTimeout(() => {
        setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    return (
        <Stack sx={{gap: 2, display: 'flex', bgcolor: 'white', flexGrow: 1}}>

            <h2>Add User to Tournament</h2>

            <Autocomplete
                sx={{maxWidth: 360}}
                options={searchResultUsers}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                    <TextField {...params} label="Search Users" variant="outlined" />
                )}
                onChange={(event, user) => {
                    if (user) {
                        setAddedUser(user)
                    }
                }}
                onInputChange={(event, newInputValue) => {
                    setSearchTerm(newInputValue);
                }}
            />


            <Button variant="contained"
                sx={{maxWidth: 360}}
                onClick={() => {
                    if (addedUser?.id != null){
                        sendData('PUT', `/api/tournament_entrants/${selectedTournament.id}/${addedUser.id}`, null, fetchEntrants)
                    }
                }}
            >Add User</Button>
        </Stack>
    )
}

function OpenTournamentArea({selectedTournament, setSelectedTournament, entrants, fetchEntrants, tournamentList, setTournamentList}){
    const [selectedUser, setSelectedUser] = useState({});

    const closeTournament = () => {
        fetchData(`api/tournaments/${selectedTournament.id}`, setSelectedTournament);
        fetchData(`/api/tournaments/all`, setTournamentList);
    }

    return (
        <Box sx={{gap: 2, display: 'flex', bgcolor: 'white', height:'100%', width: "100%"}} >
            <EntrantTable selectedTournament={selectedTournament} entrants={entrants} selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>

            {selectedUser?.id == null ? 
                (
                     <>
                    <AddUserArea selectedTournament={selectedTournament} fetchEntrants={fetchEntrants}/>

                    <Stack sx={{gap: 2, display: 'flex', bgcolor: 'white', flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}>

                        <Button variant="contained"
                        sx={{maxWidth: 360}}
                        onClick={() => {
                            sendData('PUT', `/api/tournaments/close/${selectedTournament.id}`, null, closeTournament)
                        }}
                        >Close Tournament</Button>

                    </Stack>
                    </>
                ) 
            : 
                (
                    <>
                    <Stack sx={{gap: 2, display: 'flex', bgcolor: 'white', flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <h2>Selected User: {selectedUser.name}</h2>

                        <Button variant="contained"
                        sx={{maxWidth: 360}}
                        onClick={() => {
                            sendData('DELETE', `/api/tournament_entrants/${selectedTournament.id}/${selectedUser.id}`, null, fetchEntrants)
                            setSelectedUser({});
                        }}
                        >Remove User From Tournament</Button>

                        <Button variant="contained"
                        sx={{maxWidth: 360}}
                        onClick={() => {
                            setSelectedUser({});
                        }}
                        >Cancel</Button>

                    </Stack>
                    
                    </>
                )
                
            }
           

        </Box>
    )
}


function TournamentDetailsArea({selectedTournament, setSelectedTournament, tournamentList, setTournamentList}){

    const [entrants, setEntrants] = useState([]);

    const [topMatchRaw, setTopMatchRaw] = useState({});

    const fetchEntrants = () => {fetchData(`/api/tournament_entrants/${selectedTournament.id}`, setEntrants);}

    const fetchTopMatch = () => {fetchData(`/api/tournament_matches/top/${selectedTournament.id}`, setTopMatchRaw);}

    useEffect(() => {
        if (selectedTournament?.id != null) {
            if (selectedTournament?.closed) {
                fetchTopMatch();
            }
            else {
                fetchEntrants();
            }

            
        }
    }, [selectedTournament]);
    
    return (
        <Box sx={{gap: 2, display: 'flex', bgcolor: 'white', height:'100%', width: "100%"}} >
            {selectedTournament?.id != null ? 
                ( <>
                
                {selectedTournament?.closed ? 
                    (<h1>Closed</h1>) 
                :
                    (<OpenTournamentArea tournamentList={tournamentList} setTournamentList={setTournamentList} entrants={entrants} selectedTournament={selectedTournament} setSelectedTournament={setSelectedTournament} fetchEntrants={fetchEntrants}/>)}
                </>
                )
            :
                (<TournamentNotSelectedArea message={"Please select a tournament to view it"}/>)}
        </Box>
        
    )

}

export default TournamentDetailsArea