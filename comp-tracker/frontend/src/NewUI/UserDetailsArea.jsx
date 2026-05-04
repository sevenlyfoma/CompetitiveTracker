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

import fetchData from '../helpers/Fetcher';

import MatchHistoryGraph from './MatchHistoryGraph';



const columns = [
  { field: 'Opponent', headerName: 'Opponent', width: 80 },
  { field: 'Result', headerName: 'Result', width: 40 },
  { field: 'Elo Change', headerName: 'Elo Change', width: 40 },
  { field: 'Date', headerName: 'Date', width: 80 },
  
];

const paginationModel = { page: 0, pageSize: 5 };

function UserMatchRow({selectedUser, match}){
    let userResult = match.participants[1];
    let oppoResult = match.participants[0];

    if (match.participants[0].user.id === selectedUser.id){
        userResult = match.participants[0];
        oppoResult = match.participants[1];
    }

    let result = "Win"
    if (userResult.points == 0){
        result = "Loss"
    }

    let eloChange = userResult.ratingAfter - userResult.ratingBefore;

    let dateObj = new Date(match.dateOfMatch);
    let dateStr = dateObj.toLocaleString()

    return (
        <TableRow
            key={match.id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
            <TableCell component="th" scope="row">
                {oppoResult.user.name}
            </TableCell>
            <TableCell align="right">{result}</TableCell>
            <TableCell align="right">{eloChange}</TableCell>
            <TableCell align="right">{dateStr}</TableCell>
        </TableRow>
    )
}


function UserMatchTable({selectedUser, matches, pageNumber}){

    let pagedMatches = matches.slice(pageNumber*pageSize, pageNumber*pageSize+pageSize)

    return (
        <TableContainer component={Paper}>
        <Table sx={{}} aria-label="User Table of Match History">
            <TableHead>
            <TableRow>
                <TableCell>Opponent</TableCell>
                <TableCell align="right">Result</TableCell>
                <TableCell align="right">Elo Change</TableCell>
                <TableCell align="right">Date</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {pagedMatches.map((match) => (
                <UserMatchRow selectedUser={selectedUser} match={match}/>
            ))}
            </TableBody>
        </Table>
        </TableContainer>


    );
}

const pageSize = 8

function UserDetailsArea({selectedUser}){

    const [data, setData] = useState([]);

    useEffect(() => {if (selectedUser?.id != null) {fetchData(`/api/matches/all/${selectedUser.id}`, setData);}}, [selectedUser]);

    const [pageNumber, setPageNumber] = useState(0);
    const [totalPageNumber, setTotalPageNumber] = useState(0);

    useEffect(() => {setTotalPageNumber(Math.ceil(data.length / pageSize))}, [data]);

    return (
        <Box sx={{ gap: 2, display: 'flex', bgcolor: 'white', width: '100%', height:'100%'}} >
            <Stack  spacing={2} sx={{ bgcolor: 'white', height:'100%'}}>
            <h2>{selectedUser.name} ({selectedUser.pronouns})</h2>
            <h3>{selectedUser.rating} elo</h3>

            <Box sx={{ display: 'flex', flexGrow: 1}} >
                <UserMatchTable matches={data} selectedUser={selectedUser} pageNumber={pageNumber}/>
            </Box>

            <Pagination 
                count={totalPageNumber} 
                page={pageNumber + 1} 
                onChange={(event, value) => setPageNumber(value - 1)} 
                color="primary" 
            />
            



            </Stack>

            <Box sx={{ display: 'flex', flexGrow: 1}} >

                <MatchHistoryGraph user={selectedUser} matches={data} />
            </Box>
        

        </Box>
    );
}

export default UserDetailsArea;