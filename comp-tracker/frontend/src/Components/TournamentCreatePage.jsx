import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import Button from '@mui/material/Button';

import { useState, useEffect } from 'react'

import { sendData } from '../helpers/Fetcher';

import { Autocomplete, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import toast from 'react-hot-toast';


function TournamentCreatePage(){
    const [tournament, setTournament] = useState({name: "", style: "single"});

    useEffect(() => {console.log("Updated Tournament State:", tournament);}, [tournament]);

    function handleChange(e) {
        const { name, value, type } = e.target;

        setTournament((prevTour) => ({
        ...prevTour,
        [name]: value,
        }));
    }

    function onPost() {
        setTournament({name: "", style: "single"})
        toast.success("Tournament created successfully")
    }

    return (
        <Stack sx={{gap: 2, display: 'flex', bgcolor: 'white', height:'100%'}} >
            <h1>Enter New Tournament Details</h1>

            <TextField id="name-entry-field" label="Name" variant="outlined" 
                sx={{maxWidth: 360 }}
                name='name'
                value={tournament.name}
                onChange={(event) => {handleChange(event)}}
            />

            <FormControl style={{width: 360}}>
                <InputLabel id="style-select-label">Tournmament Style</InputLabel>
                <Select
                    labelId="style-select-label"
                    onChange={handleChange}
                    defaultValue={''}
                    name="style"
                
                >
                    <MenuItem value={"single"}>Single Elim</MenuItem>
                    <MenuItem value={"double"}>Double Elim</MenuItem>


                </Select>
            </FormControl>


            <Button variant="contained"
                sx={{maxWidth: 360}}
                onClick={() => {
                    sendData('POST', `/api/tournaments`, tournament, onPost)
                }}
            >Submit</Button>




        </Stack>
        
    )

}

export default TournamentCreatePage;