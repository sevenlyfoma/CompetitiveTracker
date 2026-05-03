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

function HomePage(){

    const [userList, setUserList] = useState([]);

    const [selectedUser, setSelectedUser] = useState(-1);

    const [pageNumber, setPageNumber] = useState(0);

    const [data, setData] = useState({});

    const [totalPageNumber, setTotalPageNumber] = useState(0);

    useEffect(() => {
        setUserList(data?.content ?? []);
        setTotalPageNumber(data?.page?.totalPages ?? 0);
    }, [data]);

    useEffect(() => {fetchData(`/api/users/group/${pageSize}/${pageNumber}`, setData);}, [pageNumber]);
    
    
    const increasePageNumber = () => {
        console.log(userList)
        if (userList.length !== 0){
            setPageNumber(pageNumber + 1);
        }
    };
    const decreasePageNumber = () => {
        if (pageNumber > 0){
            setPageNumber(pageNumber - 1);
        }
    };

    return (
      <Box sx={{ gap: 2, display: 'flex', bgcolor: 'red', height:'100%'}} >
        <Stack  spacing={2} sx={{ bgcolor: 'white', height:'100%'}}>
           
            <Box sx={{}} >
                <h1>Users</h1>
                
            </Box>

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

        <Box sx={{ display: 'flex', bgcolor: 'green', flexGrow: 1, height:'100%'}} ><h1>future content</h1></Box>
        
    
      </Box>

    );

}

export default HomePage