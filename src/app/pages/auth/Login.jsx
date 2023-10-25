import { Button, IconButton, Input, InputAdornment, InputLabel, Typography, useMediaQuery } from '@mui/material';
import { Stack } from '@mui/system';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import React, { useEffect, useState } from 'react';
import AuthFrame from './AuthFrame';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogin, setLoginUsername } from '../../store/slices/AuthSlice';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import * as Yup from 'yup'
import { useFormik } from 'formik';
import secureLocalStorage from 'react-secure-storage';
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Hero from "../../components/Hero";
import Features from "../../components/Features";
import Benefits from "../../components/Benefits";
import Blogs from "../../components/Blogs";
import PriceTable from "../../components/PriceTable";
import Testimonials from "../../components/Testimonials";
import Footer from "../../components/Footer";
const initialValues = {
    username: "",
    password: "",
}

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [failedOpen, setFailedOpen] = useState(false);
    const navigate = useNavigate();
    const { loading, error, errorMsg, isLoggedIn } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [errorMsg2, setErrorMsg2] = useState('');
    const [password, setPassword] = useState('');

    const mob = useMediaQuery("(max-width:600px)");
    const loginSchema = Yup.object({
        username: Yup.string().required('Username should not be empty'),
        password: Yup.string().required("Password should not be empty"),
    })

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: loginSchema,

        onSubmit: async (values, action) => {
            // if (localStorage.getItem('access') == null) {
                localStorage.clear();
                secureLocalStorage.clear();
                let username = values.username;
                let password = values.password;
                let rep = await dispatch(adminLogin({ username, password }));
                if (rep.payload && rep.payload !== false) {
                    navigate('/');
                    setTimeout(() => {
                        window.location.reload(true);
                    }, 1000);
                }
                dispatch(setLoginUsername(username));
                setFailedOpen(!error);
            // } else {
            //     navigate('/')
            //     setErrorMsg2(`You are already logged in with this '${localStorage.getItem('username')}' username. Please refresh the page once`)
            //     // window.location.reload(true);
            // }
        }
    })

    if (localStorage.getItem('access') !== null) {
        navigate('/');
        // window.location.reload(true);
    }

    return (
        <div>
<Header />

<main className="container mt-4 md:flex flex-row-reverse justify-between items-center">
      <div className="md:max-w-[50%]">
      <AuthFrame title={'Log In'}>
            <Typography marginTop={2} marginBottom={5}>
                
            </Typography>
            <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    {error && <Typography color={'error'}>Username or password is incorrect</Typography>}
                    <InputLabel htmlFor='email'>Username</InputLabel>
                    <Input
                        value={"" || values.username}
                        onChange={handleChange}
                        name='username'
                        inputProps={{ style: { textTransform: "none" } }}
                        placeholder="Username"
                    />
                    {errors.username && touched.username ? <p style={{ color: "red", marginBottom: "0px" }}>{errors.username}</p> : null}
                    <InputLabel htmlFor='password'>Password</InputLabel>
                    <Input
                        value={"" || values.password}
                        onChange={handleChange}
                        name='password'
                        inputProps={{ style: { textTransform: "none" } }}
                        placeholder="Password"
                        fullWidth
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position='end'>
                                <IconButton
                                    aria-label='toggle password visibility'
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge='end'
                                    size='large'
                                >
                                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    {errors.password && touched.password ? <p style={{ color: "red", marginBottom: "0px" }}>{errors.password}</p> : null}
                    <Typography color='red' textAlign='center'>
                        {errorMsg || errorMsg2}
                    </Typography>
                    {mob ? (null) : (<Link to='/forget-password'>
                        <Typography variant='h6' fontWeight={"600"} fontSize={"12px"} textAlign='end'>
                            Forgot password?
                        </Typography>
                    </Link>
                    )}
                    {loading ? (
                        <Loader />
                    ) : (
                        <Button variant='contained' type='submit' color='warning' sx={{ padding: 1.5 }}>
                            Login
                        </Button>
                    )}
                    {!mob ? (null) : (<Link to='/forget-password'>
                        <Typography variant='h6' fontWeight={"600"} mt={0} mb={0} fontSize={"12px"} textAlign='center'>
                            Forgot password?
                        </Typography>
                    </Link>
                    )}
                </Stack>
            </form>
        </AuthFrame>
      </div>

       {/* text section */}
      <div className="text-center sm:text-left md:max-w-[40%]">
        <h1 className="font-bold text-4xl leading-[60px]">
        Empowering Holistic Growth in Students with GYSP
        </h1>
        <p className="mt-4 text-[18px] leading-[28px] font-normal">
        Experience the Confluence of Academic Excellence and Co-Curricular Brilliance with Our Dynamic Reporting and Analytical Tools
        </p>
        <div className="mt-8 flex items-center justify-around sm:justify-start sm:space-x-8">
          <button className="primary-button">Get Started</button>
          
        </div>
      </div>
    </main>

<Features />

<Benefits/>
<PriceTable/>

<Testimonials/>

{/* Made with Love in India by Anand Chowdhary */}
<Footer/>
        
        </div>
    );
}
