import * as React from 'react';
import { Typography } from '@mui/material'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Link, NavLink } from 'react-router-dom';

export default function Failed({ title, desc, btnTxt, open, setOpen }) {

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Dialog
            maxWidth='xs'
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            {/* <DialogTitle id="alert-dialog-title"> */}
            <Typography variant='h4' textAlign='center' marginTop={2}>{title}</Typography>
            {/* </DialogTitle> */}
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {desc}
                </DialogContentText>
            </DialogContent>
            {/* <DialogActions > */}
            <Button onClick={handleClose} variant='contained' color='error' sx={{ padding: 1.5, margin: 3 }} >{btnTxt}</Button>
            {/* </DialogActions> */}
        </Dialog>
    );
}