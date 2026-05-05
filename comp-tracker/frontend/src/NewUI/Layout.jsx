import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

import { Outlet } from "react-router";

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import AddIcon from '@mui/icons-material/Add';
import DataArrayIcon from '@mui/icons-material/DataArray';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';

import { AppBar, Toolbar, Button, Stack, Typography} from '@mui/material';

import {fetchData} from '../helpers/Fetcher';

function HorizontalNav() {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{bgcolor: "lightgrey"}}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, fontWeight: 'bold' }}
          >
            Competitive Tracker
          </Typography>

          <Button 
            component={Link} 
            to="/home" 
            startIcon={<HomeIcon />}
            color="inherit"
          >
            Home
          </Button>

          <Button 
            component={Link} 
            to="/create/user" 
            startIcon={<AddIcon />}
            color="inherit"
          >
            Create New User
          </Button>

          <Button 
            component={Link} 
            to="/tournaments" 
            startIcon={<DataArrayIcon />}
            color="inherit"
          >
            Tournaments
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}


function Layout() {

  return (
    <Stack sx={{ display: 'flex', minHeight: '100vh', height: '100vh', bgcolor: 'white' }}>

      <HorizontalNav />

      <Box component="main"  sx={{ flexGrow: 1, p:3, width: '100%', height: '100%', boxSizing: 'border-box'}} >
        <Outlet />
      </Box>


    </Stack>
  );
}

export default Layout