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

import fetchData from '../helpers/Fetcher';


const pageSize = 4;

function UserTable({users, selectedUser, setSelectedUser, pageNumber}){
    return (
        <TableContainer component={Paper}  sx={{ maxWidth: 240, minWidth: 240, height: '100%',overflowY: 'auto', direction: 'rtl',}}>
        <Table stickyHeader sx={{ maxWidth: 240, direction: 'ltr' }} aria-label="User Table">
            <TableHead>
            <TableRow>
                <TableCell></TableCell>
                <TableCell>User</TableCell>
                <TableCell align="right">Rating</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {users.map((user, index) => (
                <TableRow
                key={user.id}
                onClick={() => setSelectedUser(user.id)}
                hover
                selected={selectedUser === user.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                <TableCell>
                    {index+1 + (pageNumber*pageSize)}
                </TableCell>
                <TableCell component="th" scope="row">
                    {user.name}
                </TableCell>
                <TableCell align="right">{user.rating}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>


    )
}


function UserTableArea({selectedUser, setSelectedUser}){
    const [userList, setUserList] = useState([]);

    const [searchResultUsers, setSearchResultUsers] = useState([]);

    const [pageNumber, setPageNumber] = useState(0);

    const [data, setData] = useState({});

    const [totalPageNumber, setTotalPageNumber] = useState(0);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");


    useEffect(() => {
        setUserList(data?.content ?? []);
        setTotalPageNumber(data?.page?.totalPages ?? 0);
    }, [data]);

    useEffect(() => {fetchData(`/api/users/group/${pageSize}/${pageNumber}`, setData);}, [pageNumber]);

    useEffect(() => {if (searchTerm !== "") {fetchData(`/api/users/search/${debouncedSearch}`, setSearchResultUsers);}}, [debouncedSearch]);

    useEffect(() => {
        const timer = setTimeout(() => {
        setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);
    

    return (
        <Stack  spacing={2} sx={{ bgcolor: 'white', height:'100%'}}>
        
            <Box sx={{}} >
                <h1>Users</h1>
                
            </Box>

            <Autocomplete
                options={searchResultUsers}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                    <TextField {...params} label="Search Users" variant="outlined" />
                )}
                onChange={(event, user) => {
                    if (user) {
                        setSelectedUser(user.id)
                    }
                }}
                onInputChange={(event, newInputValue) => {
                    setSearchTerm(newInputValue);
                }}
            />

            <Box sx={{flexGrow: 1, minHeight: 0}} >
                <UserTable users={userList} selectedUser={selectedUser} setSelectedUser={setSelectedUser} pageNumber={pageNumber}/>
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


export default UserTableArea