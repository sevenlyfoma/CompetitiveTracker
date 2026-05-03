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


import fetchData from '../helpers/Fetcher';

function NavList({toggleDrawer , open}) {
  return (
      <nav aria-label="Page Navigation Options">
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={toggleDrawer}>
              <ListItemIcon>
                <MenuIcon />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/home">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Home" 
                sx={{ display: open ? 'block' : 'none', whiteSpace: 'nowrap' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/create-user">
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Create New User" 
                sx={{ display: open ? 'block' : 'none', whiteSpace: 'nowrap' }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/tournaments">
              <ListItemIcon>
                <DataArrayIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Tournaments" 
                sx={{ display: open ? 'block' : 'none', whiteSpace: 'nowrap' }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
  );
}


function Layout() {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {setOpen(!open);};

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'white' }}>

      <Box compoent="nav" sx={{ width: '100%', maxWidth: open ? 240 : 60, transition: '0.3s', height:'100vh', bgcolor: 'lightgrey' }}>
        <NavList toggleDrawer={toggleDrawer} open={open}/>
      </Box>
      

      <Box component="main"  sx={{ flexGrow: 1, p: 3, width: '100%',}} >
        <Outlet />
      </Box>


    </Box>
  );
}

export default Layout