import { Box, Button, CircularProgress, Input, InputLabel, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { useState } from 'react'
import { AxiosNoToken } from '../../axios/AxiosObj'
import Success from '../../components/dialogs/Success'
import AuthFrame from './AuthFrame'
import { toast } from 'react-toastify';

export default function ForgetPassword() {
    const [open, setOpen] = useState(false)
    const [openOTP, setOpenOTP] = useState(false)

    const [username, setUsername] = useState('')
    
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [cPassword, setCPassword] = useState('')


    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const handleResetLink = () => {
        sendResetLink()
    }

    const sendResetLink = async () => {
        if (username == "") {
            toast.error("Fill required field", {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
            return;
        }
        setLoading(true)
        let data = JSON.stringify({
            "username": username
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'account/reset/password/',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        AxiosNoToken.request(config)
            .then((response) => {
                if (response.data?.errors) {
                    setError(true)
                } else {
                    toast.success(response.data.Data[0], {
                        position: "top-right",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    })
                    setError(false)
                    setOpenOTP(true)
                }
            })
            .catch((error) => {
                toast.error(error.response.data.Data[0], {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                })
            }).finally(() => {
                setLoading(false)
            });
    }

    const sendChangePwd = async () => {
        if (otp == "" || newPassword == "" || cPassword == "") {
            toast.error("Fill required field", {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
            return;
        }

        if (newPassword !== cPassword) {
            toast.error("Both password should be same", {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
            return;
        }

        setLoading(true)
        let data = JSON.stringify({
            "otp": otp,
            "username": username,
            "new_password": newPassword,
            "confirm_password": cPassword
        });

        let config = {
            method: 'patch',
            maxBodyLength: Infinity,
            url: 'account/change/password/otp/',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        AxiosNoToken.request(config)
            .then((response) => {
                console.log(response.data);
                // if (response.data?.errors) {
                //     setError(true)
                // } else {
                //     toast.success(response.data.Data[0], {
                //         position: "top-right",
                //         autoClose: 2500,
                //         hideProgressBar: false,
                //         closeOnClick: true,
                //         pauseOnHover: true,
                //         draggable: true,
                //         progress: undefined,
                //         theme: "light",
                //     })
                //     setError(false)
                //     setOpenOTP(true)
                // }
            })
            .catch((error) => {
                toast.error(error.response.data.Data[0], {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                })
            }).finally(() => {
                setLoading(false)
            });
    }

    return (
        <AuthFrame title={'Reset Password'}>
            {openOTP ? <>
                <Typography marginTop={2} marginBottom={5}>
                    We will send you password reset link to your registered email.
                </Typography>

                <form action="">
                    <Stack spacing={2}>
                        {error ? <Typography color={'error'} >You are not a Registered User</Typography> : null}
                        <InputLabel htmlFor='otp'  >OTP</InputLabel>
                        <Input value={otp} onChange={e => setOtp(e.target.value)} />
                        <InputLabel htmlFor='Password'>New Password</InputLabel>
                        <Input value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                        <InputLabel htmlFor='confirm_password'>Confirm Password</InputLabel>
                        <Input value={cPassword} onChange={e => setCPassword(e.target.value)} />
                        {loading ?
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress />
                            </Box> :
                            <Button variant='contained' color='warning' sx={{ padding: 1.5 }} onClick={sendChangePwd}>Change</Button>}
                    </Stack>
                </form>
            </> : <>
                <Typography marginTop={2} marginBottom={5}>
                    We will send you password reset link to your registered email.
                </Typography>

                <form action="">
                    <Stack spacing={2}>
                        {error ? <Typography color={'error'} >You are not a Registered User</Typography> : null}
                        <InputLabel htmlFor='email'  >Username</InputLabel>
                        <Input value={username} onChange={e => setUsername(e.target.value)} />
                        {loading ?
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress />
                            </Box> :
                            <Button variant='contained' color='warning' sx={{ padding: 1.5 }} onClick={handleResetLink}>Get Password reset link</Button>}
                    </Stack>
                </form>
            </>}
            {open ? <Success open={open} setOpen={setOpen} location={'/login'} title={'Success'} desc={'We have sent password reset link to your registered email. Please check and reset your password.'} btnTxt={'Continue'} /> : null}
        </AuthFrame>
    )
}
