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

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import {fetchData} from '../helpers/Fetcher';

import { Link } from 'react-router-dom';

const pageSize = 9;

function TournamentTable({tournaments, selectedTournament, setSelectedTournament, pageNumber}){
    let pagedTournaments = tournaments.slice(pageNumber*pageSize, pageNumber*pageSize+pageSize)

    return (
        <TableContainer component={Paper}  sx={{ maxWidth: 240, minWidth: 240, height: '100%',overflowY: 'auto', direction: 'rtl',}}>
        <Table stickyHeader sx={{ maxWidth: 240, direction: 'ltr' }} aria-label="Tournament Table">
            <TableHead>
            <TableRow>
                <TableCell>Tournament</TableCell>
                <TableCell align="right">Status</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {pagedTournaments.map((tour, index) => (
                <TableRow
                key={tour.id}


                onClick={() => setSelectedTournament(tour)}
                hover
                selected={selectedTournament.id === tour.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                <TableCell component="th" scope="row">
                    {tour.tournamentName}
                </TableCell>
                <TableCell align="right">{tour.closed ? "Closed" : "Open"}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>


    )
}


function TournamentTableArea({selectedTournament, setSelectedTournament, tournamentList, setTournamentList}){

    const [pageNumber, setPageNumber] = useState(0);

    const [totalPageNumber, setTotalPageNumber] = useState(0);

    useEffect(() => {setTotalPageNumber(Math.ceil(tournamentList.length / pageSize))}, [tournamentList]);

    useEffect(() => {fetchData(`/api/tournaments/all`, setTournamentList);}, []);

    return (
        <Stack  spacing={2} sx={{ bgcolor: 'white', height:'100%'}}>
        
            <Box sx={{}} >
                <h1>Tournaments</h1>
                
            </Box>

            <Box sx={{flexGrow: 1, minHeight: 0}} >
                <TournamentTable tournaments={tournamentList} selectedTournament={selectedTournament} setSelectedTournament={setSelectedTournament} pageNumber={pageNumber}/>
            </Box>

            <Pagination 
                count={totalPageNumber} 
                page={pageNumber + 1} 
                onChange={(event, value) => setPageNumber(value - 1)} 
                color="primary" 
            />

        </Stack>

    );
}


export default TournamentTableArea