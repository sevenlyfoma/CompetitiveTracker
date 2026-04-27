import { useState, useEffect } from 'react'

import fetchData from './helpers/Fetcher';


function HomePage() {
  const [userList, setUserList] = useState([]);

  useEffect(() => {fetchData("/api/users/all", setUserList); }, []);


  return (
    <>
    <h1>Hello world</h1>
    </>
  );
}

export default HomePage