import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import UserList from './UserList.jsx'
import MatchList from './MatchList.jsx'
import UserMatchList from './UserMatchList.jsx'
import TournamentList from './TournamentList.jsx';
import TournamentEntrantList from './TournamentEntrantList.jsx';
import TournamentBracketPage from './TournamentBracketPage.jsx';
import TournamentMatchPage from './TournamentMatchPage.jsx';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
         <Route path="/" element={< UserList />} />
         <Route path="/userpages/:userID" element={<UserMatchList />} />
         <Route path="/matches" element={<MatchList />} />
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