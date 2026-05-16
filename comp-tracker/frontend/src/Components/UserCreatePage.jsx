import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import Button from '@mui/material/Button';

import { useState, useEffect } from 'react'

import { sendData } from '../helpers/Fetcher';

import toast from 'react-hot-toast';

function UserCreatePage(){

    const [user, setUser] = useState({name: "", email: "", pronouns: ""});

    useEffect(() => {console.log("Updated User State:", user);}, [user]);

    function handleChange(e) {
        const { name, value, type } = e.target;

        setUser((prevUser) => ({
        ...prevUser,
        [name]: value,
        }));
    }

    function onPost() {
        setUser({name: "", email: "", pronouns: ""})
        toast.success("User created successfully")
    }

    return (
        <Stack sx={{gap: 2, display: 'flex', bgcolor: 'white', height:'100%'}} >
            <h1>Enter New User Details</h1>

            <TextField id="name-entry-field" label="Name" variant="outlined" 
                sx={{maxWidth: 360 }}
                name='name'
                value={user.name}
                onChange={(event) => {handleChange(event)}}
            />

            <TextField id="email-entry-field" label="Email" variant="outlined" 
                sx={{maxWidth: 360 }}
                name='email'
                value={user.email}
                onChange={(event) => {handleChange(event)}}
            />


            <TextField id="pronoun-entry-field" label="Pronouns" variant="outlined" 
                sx={{ maxWidth: 360}}
                name='pronouns'
                value={user.pronouns}
                onChange={(event) => {handleChange(event)}}
            />

            <Button variant="contained"
                sx={{maxWidth: 360}}
                onClick={() => {
                    sendData('POST', `/api/users`, user, onPost)
                }}
            >Submit</Button>




        </Stack>
        
    )
}

export default UserCreatePage