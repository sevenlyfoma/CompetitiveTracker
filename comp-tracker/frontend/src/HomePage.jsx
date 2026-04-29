import { useState, useEffect } from 'react'

import fetchData from './helpers/Fetcher';


//Look into outlet with react router dom to make the sidebare render the same every time

//https://www.npmjs.com/package/react-pro-sidebar

import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';


function HomePage() {
  const [userList, setUserList] = useState([]);

  useEffect(() => {fetchData("/api/users/all", setUserList); }, []);


  return (
    <>
    <Sidebar>
      <Menu>
        <SubMenu label="Charts">
          <MenuItem> Pie charts </MenuItem>
          <MenuItem> Line charts </MenuItem>
        </SubMenu>
        <MenuItem> Documentation </MenuItem>
        <MenuItem> Calendar </MenuItem>
      </Menu>
    </Sidebar>
    </>
  );
}

export default HomePage