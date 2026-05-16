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

import { Autocomplete, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import {TextField} from '@mui/material';

import toast from 'react-hot-toast';

function UndecidedMatchBody({selectedMatch, setSelectedMatch, user1, user2}){

    console.log(setSelectedMatch)

    const [result, setResult] = useState({userIds: [user1.id, user2.id], points : []});

    useEffect(() => {
        console.log("Updated Result State:", result);
    }, [result]);

    function handleChange(e) {
        const {value} = e.target;
        let winner = -1
        let loser = -1

        if (value === "user1"){
            setResult((prevResult) => ({
            ...prevResult,
            points: [1, 0]
            }));
        }
        if (value === "user2"){
            setResult((prevResult) => ({
            ...prevResult,
            points: [0, 1]
            }));
        }

        
    }

    function handleFetch(){ fetchData(`/api/tournament_matches/${selectedMatch.id}`, setSelectedMatch)}

    function handleSend(){
        sendData(
            "PUT",
            `/api/tournament_matches/report/${selectedMatch.id}`, 
            result, 
            handleFetch
        );
    }


    return (
        <>
        <FormControl fullWidth style={{maxWidth: 240}}>
        <InputLabel id="winner-select-label">Winner</InputLabel>
        <Select
            labelId="winner-select-label"
            label="Winner"
            onChange={handleChange}
            defaultValue={''}
        
        >
            <MenuItem value={"user1"}>{user1.name}</MenuItem>
            <MenuItem value={"user2"}>{user2.name}</MenuItem>


        </Select>
        </FormControl>

        <Button variant="contained" 
        style={{maxWidth: 240}}
        
        onClick={handleSend} 
        
        >Send Result</Button>
        </>
    )
}

function FinalisedMatchBody({selectedMatch}){
    let winner = null;
    if (selectedMatch?.matchRecord?.participants[0]?.points == 1){
        winner = selectedMatch?.matchRecord?.participants[0]?.user?.name;
    }
    if (selectedMatch?.matchRecord?.participants[1]?.points == 1){
        winner = selectedMatch?.matchRecord?.participants[1]?.user?.name;
    }

    let p1 = selectedMatch.matchRecord?.participants[0];
    let p2 = selectedMatch.matchRecord?.participants[1];
 

    return (
    
    <>
    <h3>Winner: {winner}</h3>
    <h4>Rating change:</h4>
    <p>{p1.user.name}: {p1.ratingBefore} -{'>'} {p1.ratingAfter}</p>
    <p>{p2.user.name}: {p2.ratingBefore} -{'>'} {p2.ratingAfter}</p>
    </>)
}

function MatchDetailsArea({selectedMatch, setSelectedMatch}){

    console.log(selectedMatch)
    

    let defaultMsg = "(Participant Yet to be Confirmed)";

    let p1 = selectedMatch?.parents[0] ?? null;
    let p2 = selectedMatch?.parents[1] ?? null;

    let user1Name = p1.user?.name ?? defaultMsg;
    let user2Name = p2.user?.name ?? defaultMsg;

    

    return (

        <Paper  elevation={2} sx={{height:'100%', width: "100%"}}>
        <Stack sx={{gap: 2, display: 'flex', bgcolor: 'white', textAlign: 'center', height:'100%', width: "100%", alignItems: 'center'}}>
            <h1>{selectedMatch.matchTitle}</h1>
            <h2>{user1Name}  vs {user2Name}</h2>

            <>
            { (p1 === null || p2 === null) ?
                (<p>No details to be displayed</p>)
            :
                (<>
                    {selectedMatch.matchRecord == null ? 
                        (<>
                            <UndecidedMatchBody setSelectedMatch={setSelectedMatch} selectedMatch={selectedMatch} user1={p1.user} user2={p2.user}/>
                        </>) 
                    : 
                        (<>
                            <FinalisedMatchBody selectedMatch={selectedMatch} />
                        </>)}
                   
                
                </>)
            
            }
            </>
        
        <Button variant="contained" onClick={() => setSelectedMatch(null)} style={{maxWidth: 240}}>Back to tournament</Button>

        </Stack>

        </Paper>
                
    )
}

export default MatchDetailsArea