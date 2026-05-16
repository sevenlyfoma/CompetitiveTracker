import { StrictMode } from 'react' // React core stuff
import { createRoot } from 'react-dom/client'


import './index.css'
// import './newindex.css'


import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
