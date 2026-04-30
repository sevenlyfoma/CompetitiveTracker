import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

import { Outlet } from "react-router";

import fetchData from './helpers/Fetcher';


//Look into outlet with react router dom to make the sidebare render the same every time

//https://www.npmjs.com/package/react-pro-sidebar

import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';


function Layout() {
  const [userList, setUserList] = useState([]);

  useEffect(() => {fetchData("/api/users/all", setUserList); }, []);


  return (
    <>
    <Sidebar>
      <Menu>
        <MenuItem> Create User </MenuItem>
        <MenuItem component={<Link to="/tournaments"/>}>   View Tournaments </MenuItem>
      </Menu>
    </Sidebar>

    <Outlet/>
    </>
  );
}

export default Layout