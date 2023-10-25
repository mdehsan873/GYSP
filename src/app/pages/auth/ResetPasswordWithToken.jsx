import { Button, Card, IconButton, Input, InputAdornment, InputLabel, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import React, { useState } from 'react'
import AuthFrame from './AuthFrame'
import AxiosObj from '../../axios/AxiosObj';
import Loader from '../../components/Loader';
import Success from '../../components/dialogs/Success';
import secureLocalStorage from 'react-secure-storage';

export default function ResetPasswordWithToken() {
    const [showPassword, setShowPassword] = useState()
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [open, setOpen] = useState(false)
    const token = secureLocalStorage.getItem('access')

    const handlePasswordChange = async () => {
        if (password1.trim() !== password2.trim()) {
            setError('Password and Confirm password must be same')
            return null;
        }
        setLoading(true)
        let data = JSON.stringify({
            "password": password1,
            "password2": password2
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'login/changepassword/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            data: data
        };

        AxiosObj.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                if (response.data?.errors) {
                    setError('You are not a Registered User')
                } else {
                    setError('')
                    setOpen(true)

                }
            })
            .catch((error) => {
                console.log(error);
            }).finally(() => {
                setLoading(false)
            });
    }
    return (
        <Card sx={{ p: 2, m: 2, height: 'max-content', margin: 'auto' }} >
            <Typography variant='h4' fontWeight={'bolder'}>Set new password</Typography>
            <Typography marginTop={2} marginBottom={5}>
                Congrats! You can reset new password. Please create a strog password.
            </Typography>
            <form action="">
                <Stack spacing={2}>
                    {error !== '' ? <Typography color={'error'} >{error}</Typography> : null}
                    <InputLabel htmlFor='password' >Password</InputLabel>
                    <Input
                        key={'password1'}
                        fullWidth
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password1}
                        name="password"
                        onChange={e => setPassword1(e.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => { showPassword ? setShowPassword(false) : setShowPassword(true) }}
                                    edge="end"
                                    size="large"
                                >
                                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    <InputLabel htmlFor='password2' >Re-Type Password</InputLabel>
                    <Input
                        key={'password2'}
                        fullWidth
                        id="password2"
                        type={showPassword ? 'text' : 'password'}
                        value={password2}
                        name="password2"
                        onChange={e => setPassword2(e.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => { showPassword ? setShowPassword(false) : setShowPassword(true) }}
                                    edge="end"
                                    size="large"
                                >
                                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    {loading ? <Loader /> : <Button onClick={handlePasswordChange} variant='contained' color='warning' sx={{ padding: 1.5 }} >Reset Password</Button>}
                </Stack>
            </form>
            {open ? <Success open={open} setOpen={setOpen} location={'/'} title={'Success'} desc={'Your password is updated'} btnTxt={'Continue'} /> : null}
        </Card>
    )
}
