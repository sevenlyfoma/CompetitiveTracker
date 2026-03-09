import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import UserList from './UserList.jsx'
import MatchList from './MatchList.jsx'
import UserMatchList from './UserMatchList.jsx'

import CrudTable from './CrudTable.jsx';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
         <Route path="/" element={< UserList />} />
         <Route path="/userpages/:userID" element={<UserMatchList />} />
         <Route path="/matches" element={<MatchList />} />
         <Route path="/test" element={<><CrudTable data_name="users" /><CrudTable data_name="matches" /></>} />
      </Routes>
    </BrowserRouter>


    </>
  );
}

export default App