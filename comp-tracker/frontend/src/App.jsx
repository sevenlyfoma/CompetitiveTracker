import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import UserList from './UserList.jsx'
import MatchList from './MatchList.jsx'
import UserMatchList from './UserMatchList.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={< UserList />} />
         <Route path="/userpages/:userID" element={<UserMatchList />} />
         <Route path="/matches" element={<MatchList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App