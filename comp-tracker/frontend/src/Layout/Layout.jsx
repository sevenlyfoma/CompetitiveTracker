import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

import { Outlet } from "react-router";

import fetchData from '../helpers/Fetcher';

import './Layout.css';

//https://www.npmjs.com/package/react-pro-sidebar

import { Sidebar, Menu, MenuItem, SubMenu, sidebarClasses} from 'react-pro-sidebar';

import Button from '@mui/material/Button';

function ButtonUsage() {
  return <Button variant="contained">Hello world</Button>;
}


function Layout() {
  const [userList, setUserList] = useState([]);

  useEffect(() => {fetchData("/api/users/all", setUserList); }, []);


  return (
    <div className='layoutDiv'>
    <Sidebar
      rootStyles={{
        [`.${sidebarClasses.container}`]: {
          backgroundColor: 'transparent',
          height: '100vh',
          position: 'sticky',
          top: 0,
        },
      }}
    >
      <Menu>
        <MenuItem> Create User </MenuItem>
        <MenuItem component={<Link to="/tournaments"/>}>   View Tournaments </MenuItem>
      </Menu>
    </Sidebar>

    <ButtonUsage />

    <Outlet/>
    </div>
  );
}

export default Layout