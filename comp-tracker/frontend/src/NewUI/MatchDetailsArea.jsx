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

function UndecidedMatchArea(){


    return (
        <>
        </>
    )
}

function MatchDetailsArea({selectedMatch, setSelectedMatch}){

    console.log(selectedMatch)
    

    let defaultMsg = "(Participant Yet to be Confirmed)";

    let p1 = selectedMatch?.parents[0] ?? null;
    let p2 = selectedMatch?.parents[1] ?? null;

    let user1Name = p1.user?.name ?? defaultMsg;
    let user2Name = p2.user?.name ?? defaultMsg;

    let winner = null;
    if (p1.points == 1){ winner = user1Name}
    if (p2.points == 1){ winner = user2Name}

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
                    {winner === null ? 
                        (<></>) 
                    : 
                        (<>
                             <p>Winner: {winner}</p>
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