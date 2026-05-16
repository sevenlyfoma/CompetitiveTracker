import { Box } from "@mui/material"
import TournamentTableArea from "./TournamentTableArea"
import { useState, useEffect } from 'react'
import TournamentDetailsArea from "./TournamentDetailsArea";

function TournamentHome(){
    const [selectedTournament, setSelectedTournament] = useState({});

    const [tournamentList, setTournamentList] = useState([])

    return (
        <Box sx={{gap: 2, display: 'flex', bgcolor: 'white', height:'100%', width: "100%"}} >
            <TournamentTableArea selectedTournament={selectedTournament} setSelectedTournament={setSelectedTournament} tournamentList={tournamentList} setTournamentList={setTournamentList}/>


            <Box sx={{ display: 'flex', bgcolor: 'green', flexGrow: 1, minHeight: 0}} >
               <TournamentDetailsArea selectedTournament={selectedTournament} setSelectedTournament={setSelectedTournament} tournamentList={tournamentList} setTournamentList={setTournamentList}/>
            </Box>


        </Box>


    )
}

export default TournamentHome