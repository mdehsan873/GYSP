import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FormLabel, Input, Stack, Typography } from '@mui/material';
import Loader from '../../components/Loader';
import { useState, } from 'react';
import secureLocalStorage from "react-secure-storage";
import AxiosObj from '../../axios/AxiosObj';

export default function AddSession({ open, setOpen, }) {
    const [session, setSession] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const handleClose = () => {
        setOpen(false);
    };
    const addSession = async () => {
        if (!(session.charAt(4) === '-' && session.length == 7)) {
            setError('Session is not valid! (eg. 2022-23)')
            return;
        } else {
            setError('')
        }
        setLoading(true)

        let data = JSON.stringify({
            "session": session
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'session/session-create/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),  
            },
            data: data
        };
        AxiosObj.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                window.location.reload()
            })
            .catch(e => console.log(e))
            .finally(() => setLoading(false))
    }
    return (
        <div>
            <Dialog maxWidth='xs' fullWidth open={open} onClose={handleClose} >
                <DialogTitle variant='h5' >Add Session</DialogTitle>
                <DialogContent >
                    <form  >
                        <Stack spacing={2} >
                            <FormLabel>Session </FormLabel>
                            <Input value={session} placeholder='eg. 2022-23' onChange={e => setSession(e.target.value)} />
                            <Typography color={'red'}>{error}</Typography>
                        </Stack>
                    </form>
                </DialogContent>
                {loading ? <Loader /> : <Button variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} onClick={addSession} >Add Session</Button>}
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
