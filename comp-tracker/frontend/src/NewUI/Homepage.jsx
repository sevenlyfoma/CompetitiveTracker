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

import UserTableArea from './UserTableArea';

function HomePage(){

    const [selectedUser, setSelectedUser] = useState(-1);

    return (
      <Box sx={{ gap: 2, display: 'flex', bgcolor: 'red', height:'100%'}} >
        <Box sx={{height:'100%'}} >
            <UserTableArea selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
        </Box>

        <Box sx={{ display: 'flex', bgcolor: 'green', flexGrow: 1, height:'100%'}} ><h1>future content</h1></Box>
        
    
      </Box>

    );

}

export default HomePage