import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import UserList from './UserList.jsx'
import MatchList from './MatchList.jsx'
import UserMatchList from './UserMatchList.jsx'
import TournamentList from './TournamentList.jsx';
import TournamentEntrantList from './TournamentEntrantList.jsx';


function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
         <Route path="/" element={< UserList />} />
         <Route path="/userpages/:userID" element={<UserMatchList />} />
         <Route path="/matches" element={<MatchList />} />
         <Route path="/tournaments" element={<TournamentList />} />
         <Route path="/tournaments/open/:tournament" element={<TournamentEntrantList/>} />
      </Routes>
    </BrowserRouter>


    </>
  );
}

export default App