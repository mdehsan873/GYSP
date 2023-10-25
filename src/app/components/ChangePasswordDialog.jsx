import { useRef } from 'react';
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton, Input, InputAdornment, InputLabel, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import AxiosObj from '../axios/AxiosObj';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Loader from './Loader';
import { toast } from 'react-toastify';
import secureLocalStorage from "react-secure-storage";

export default function ChangePassword({ open, setOpen }) {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChange, setIsChange] = useState(false);
    const [error, setError] = useState('');

    const handlePasswordChange = async () => {
        if (newPassword.trim() !== confirmPassword.trim()) {
            setError('Password and Confirm password must be the same');
            toast.error('Password and Confirm password must be the same');
            return null;
        }

        setLoading(true);
        let data = JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
            confirm_password: confirmPassword
        });

        let config = {
            method: 'PATCH',
            maxBodyLength: Infinity,
            url: 'account/update/password/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),
            },
            data: data
        };

        AxiosObj.request(config)
            .then((response) => {
                if (response?.error) {
                    try {
                        response.data.error.map((item) => toast.error(item || 'Something went wrong...!'));
                    } catch (e) {
                        toast.error(response.data?.error || 'Something went wrong...!');
                        setError(response.data?.error || 'Something went wrong...!');
                    }
                } else {
                    toast.success("Password has been updated");
                    // Reload the window after 2 seconds
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            })
            .catch((e) => {
                toast.error(e.response.data.error || 'Something went wrong...!');
                setError(e.response.data.error || 'Something went wrong...!');
            })
            .finally(() => setLoading(false))
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeValue = (e) => {
        setIsChange(true);
        if (e.target.name === 'current_password') {
            setCurrentPassword(e.target.value);
        } else if (e.target.name === 'new_passwords') {
            setNewPassword(e.target.value);
        } else if (e.target.name === 'confirm_password') {
            setConfirmPassword(e.target.value);
        }
    };

    const buttonRef = useRef(null);

    const handleKey = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            buttonRef.current.click();
        }
    }
    return (
        <div>
            <Dialog maxWidth='xs' fullWidth open={open} onClose={handleClose}>
                <DialogTitle variant='h5'>Change Password</DialogTitle>
                <DialogContent>
                    <form action=''>
                        <Stack spacing={2}>
                            <InputLabel htmlFor='password'>Current password</InputLabel>
                            <Input
                                key={'current_password'}
                                fullWidth
                                id='current_password'
                                type={showPassword ? 'text' : 'password'}
                                value={currentPassword}
                                name='current_password'
                                onKeyDown={(e) => { handleKey(e) }}
                                onChange={handleChangeValue}
                                inputProps={{ style: { textTransform: "none" } }}
                                endAdornment={
                                    <InputAdornment position='end'>
                                        <IconButton
                                            aria-label='toggle password visibility'
                                            onClick={() => {
                                                showPassword ? setShowPassword(false) : setShowPassword(true);
                                            }}
                                            edge='end'
                                            size='large'
                                        >
                                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            <InputLabel htmlFor='new_passwords'>New Password</InputLabel>
                            <Input
                                key={'new_passwords'}
                                fullWidth
                                id='new_passwords'
                                type={showPassword ? 'text' : 'password'}
                                value={newPassword || ''}
                                name='new_passwords'
                                onKeyDown={(e) => { handleKey(e) }}
                                onChange={handleChangeValue}
                                inputProps={{ style: { textTransform: "none" } }}
                                endAdornment={
                                    <InputAdornment position='end'>
                                        <IconButton
                                            aria-label='toggle password visibility'
                                            onClick={() => {
                                                showPassword ? setShowPassword(false) : setShowPassword(true);
                                            }}
                                            edge='end'
                                            size='large'
                                        >
                                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            <InputLabel htmlFor='confirm_password'>Confirm New Password</InputLabel>
                            <Input
                                key={'confirm_password'}
                                fullWidth
                                id='confirm_password'
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onKeyDown={(e) => { handleKey(e) }}
                                name='confirm_password'
                                onChange={handleChangeValue}
                                inputProps={{ style: { textTransform: "none" } }}
                                endAdornment={
                                    <InputAdornment position='end'>
                                        <IconButton
                                            aria-label='toggle password visibility'
                                            onClick={() => {
                                                showPassword ? setShowPassword(false) : setShowPassword(true);
                                            }}
                                            edge='end'
                                            size='large'
                                        >
                                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </Stack>
                    </form>
                </DialogContent>
                {error !== '' ? <Typography textAlign={'center'} color={'red'}>{error}</Typography> : null}
                {loading ? (
                    <Loader />
                ) : (
                    <Button disabled={!isChange} ref={buttonRef} onClick={handlePasswordChange} variant='contained' color='warning' sx={{ padding: 1.5, margin: 3 }}>
                        Change Password
                    </Button>
                )}
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
