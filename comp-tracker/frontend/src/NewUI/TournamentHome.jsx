import { Box } from "@mui/material"
import TournamentTableArea from "./TournamentTableArea"
import { useState, useEffect } from 'react'

function TournamentHome(){
    const [selectedTournament, setSelectedTournament] = useState({});

    return (
        <Box sx={{gap: 2, display: 'flex', bgcolor: 'white', height:'100%', width: "100%"}} >
            <TournamentTableArea selectedTournament={selectedTournament} setSelectedTournament={setSelectedTournament}/>




        </Box>


    )
}

export default TournamentHome