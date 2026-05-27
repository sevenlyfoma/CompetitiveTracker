import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import { Toaster } from 'react-hot-toast';

import Layout from './Components/Layout.jsx';
import HomePage from './Components/Homepage.jsx';

import UserCreatePage from './Components/UserCreatePage.jsx';

import TournamentHome from './Components/TournamentHome.jsx';

import TournamentCreatePage from './Components/TournamentCreatePage.jsx';

import CssBaseline from '@mui/material/CssBaseline';

function App() {
  return (
    <>
    <CssBaseline />
    <Toaster />
    <BrowserRouter>
      <Routes>
         <Route path="/" element={< Layout />}>
          <Route path='' element={<HomePage />} />
          <Route path='create/user' element={<UserCreatePage />} />
          <Route path='tournaments' element={<TournamentHome />} />
          <Route path='create/tournament' element={<TournamentCreatePage />} />
         </Route>
      </Routes>
    </BrowserRouter>


    </>
  );
}

export default App