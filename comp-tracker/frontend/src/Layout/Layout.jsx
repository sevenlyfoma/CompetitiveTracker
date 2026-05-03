import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

import { Outlet } from "react-router";

import fetchData from '../helpers/Fetcher';

import './Layout.css';

//https://www.npmjs.com/package/react-pro-sidebar

import { Sidebar, Menu, MenuItem, SubMenu, sidebarClasses} from 'react-pro-sidebar';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import Grid from '@mui/material/Grid';

import AddIcon from '@mui/icons-material/Add';
import DataArrayIcon from '@mui/icons-material/DataArray';

function BasicList() {
  return (
    <Box sx={{ width: '100%', maxWidth: 360, height:'100vh', bgcolor: 'lightgrey' }}>
      <nav aria-label="Page Navigation Options">
        <List>
          <ListItem disablePadding>
            <ListItemButton component="a" href="createuser">
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="Create New User" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href="tournaments">
              <ListItemIcon>
                <DataArrayIcon />
              </ListItemIcon>
              <ListItemText primary="Tournaments" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  );
}


function Layout() {
  const [userList, setUserList] = useState([]);

  useEffect(() => {fetchData("/api/users/all", setUserList); }, []);


  return (
     <Box sx={{ flexGrow: 1, bgcolor: 'grey' }}>
        <Grid container spacing={0}>
          <Grid size={2}>
            <BasicList />
          </Grid>
          <Grid size={10}>
            <Outlet />
          </Grid>
        </Grid>


     </Box>
  );
}

export default Layout