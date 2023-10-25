import { Button, IconButton, Input, InputAdornment, InputLabel, Typography, useMediaQuery } from '@mui/material';
import { Stack } from '@mui/system';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import React, { useEffect, useState } from 'react';
import AuthFrame from './AuthFrame';
import { Link } from 'react-router-dom';
import Loader from './Loader';
function Login(){
    return (
    <AuthFrame title={'Log In'}>
        <Typography marginTop={2} marginBottom={5}>
            
        </Typography>
        <form >
            <Stack spacing={2}>
                {<Typography color={'error'}>Username or password is incorrect</Typography>}
                <InputLabel htmlFor='email'>Username</InputLabel>
                <Input
                    value={""}
                    
                    name='username'
                    inputProps={{ style: { textTransform: "none" } }}
                    placeholder="Username"
                />
               
                <InputLabel htmlFor='password'>Password</InputLabel>
                <Input
                    value={""}
                    
                    name='password'
                    inputProps={{ style: { textTransform: "none" } }}
                    placeholder="Password"
                    fullWidth
                    id='password'
                    type={true ? 'text' : 'password'}
                    endAdornment={
                        <InputAdornment position='end'>
                            <IconButton
                                aria-label='toggle password visibility'
                                edge='end'
                                size='large'
                            >
                                {true ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            
                <Typography color='red' textAlign='center'>
                    
                </Typography>
                {null ? (null) : (<Link to='/forget-password'>
                    <Typography variant='h6' fontWeight={"600"} fontSize={"12px"} textAlign='end'>
                        Forgot password?
                    </Typography>
                </Link>
                )}
                {false ? (
                    <Loader />
                ) : (
                    <Button variant='contained' type='submit' color='warning' sx={{ padding: 1.5 }}>
                        Login
                    </Button>
                )}
                {!true ? (null) : (<Link to='/forget-password'>
                    <Typography variant='h6' fontWeight={"600"} mt={0} mb={0} fontSize={"12px"} textAlign='center'>
                        Forgot password?
                    </Typography>
                </Link>
                )}
            </Stack>
        </form>
    </AuthFrame>
);
                }
export default Login;