import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import { Toaster } from 'react-hot-toast';

import UserList from './UserList.jsx'
import UserMatchList from './UserMatchList.jsx'
import TournamentList from './TournamentList.jsx';
import TournamentEntrantList from './TournamentEntrantList.jsx';
import TournamentMatchPage from './TournamentMatchPage.jsx';
import HomePage from './HomePage.jsx';

import TournamentBracketPage from '../TournamentBracket/TournamentBracketPage.jsx';

function App() {
  return (
    <>
    <Toaster />
    <BrowserRouter>
      <Routes>
         <Route path="/" element={< UserList />} />
         <Route path="/userpages/:userID" element={<UserMatchList />} />
         <Route path="/tournaments" element={<TournamentList />} />
         <Route path="/tournaments/open/:tournamentID" element={<TournamentEntrantList/>} />
         <Route path="/tournaments/closed/:tournamentID" element={<TournamentBracketPage/>} />
         <Route path="/tournaments/matches/:tournamentID/:tournamentMatchID" element={<TournamentMatchPage />} />
      </Routes>
    </BrowserRouter>


    </>
  );
}

export default App