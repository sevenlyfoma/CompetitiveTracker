import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import UserList from './UserList.jsx'
import MatchList from './MatchList.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserList />
    <MatchList />
  </StrictMode>,
)
