import * as React from 'react';
import { Box, Typography } from '@mui/material'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { NavLink } from 'react-router-dom';

export default function Success({ title, desc, btnTxt, location }) {
    const [open, setOpen] = React.useState(true);

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
            sx={{ padding: 1 }}
        >
            <Box p={2}>
                <Typography variant='h4' textAlign='center' marginTop={2}>{title}</Typography>
                <DialogContent >
                    <DialogContentText id="alert-dialog-description">
                        {desc}
                    </DialogContentText>
                </DialogContent>
            </Box>
            <Button component={NavLink} to={location} onClick={handleClose} variant='contained' color='warning' sx={{ padding: 1.5, margin: 3 }} >{btnTxt}</Button>
        </Dialog>
    );
}