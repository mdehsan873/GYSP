import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FormLabel, Grid, Input, Stack, Typography, InputAdornment, IconButton } from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Loader from '../../components/Loader';
import secureLocalStorage from "react-secure-storage";
import { useState } from 'react';
import AxiosObj from '../../axios/AxiosObj';
import { FormControl } from '@mui/material';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import { toast } from 'react-toastify';

export default function AddTeacher({ open, setOpen, }) {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [gender, setGender] = useState('')
    const [password, setPassword] = useState('')
    const [cpassword, setCPassword] = useState('')
    const [phoneNo, setPhoneNo] = useState('')
    const [address, setAddress] = useState('')
    const [address2, setAddress2] = useState('')
    const [state, setState] = useState('')
    const [city, setCity] = useState('')
    const [country, setCountry] = useState('')
    const [pincode, setPincode] = useState('')
    const [loading, setLoading] = useState(false)

    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('')
    const handleClose = () => {
        setName('')
        setEmail('')
        setGender('')
        setPassword('')
        setCPassword('')
        setPhoneNo('')
        setAddress('')
        setAddress2('')
        setState('')
        setCountry('')
        setPincode('')
        setErrorMsg('')
        setOpen(false);
        setShowPassword(false);
    };
    const capitalizeWords = (str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };
    const addTeacher = async (e) => {
        e.preventDefault();
        if (name == '' || phoneNo == '' || email == '' || address == '' || gender == '' || city == '' || state == '' || country == '' || password == '' || cpassword == '' || pincode == '') {
            setErrorMsg('Required field shloud not be empty')
            toast.error("Required field shloud not be empty");
            return;
        }

        if (phoneNo.length !== 10) {
            setErrorMsg('Enter a valid contact number');
            toast.error('Enter a valid contact number');
            return false;
        }

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setErrorMsg('Enter a valid email address');
            toast.error('Enter a valid email address');
            return false;
        }
        if (/\d/.test(city)) {
            setErrorMsg("City field should not contain numbers");
            toast.error("City field should not contain numbers");
            return;
        }
        if (/\d/.test(country)) {
            setErrorMsg("Country field should not contain numbers");
            toast.error("Country field should not contain numbers");
            return;
        }
        if (/\d/.test(state)) {
            setErrorMsg("State field should not contain numbers");
            toast.error("State field should not contain numbers");
            return;
        }
        if (password.length < 6) {
            setErrorMsg('Password should have at least 6 characters');
            toast.error('Password should have at least 6 characters');
            return false;
        }

        if (pincode.length !== 6) {
            setErrorMsg('Enter a valid pin code');
            toast.error('Enter a valid pin code');
            return false;
        }

        if (password !== cpassword) {
            setErrorMsg('Passwords do not match');
            toast.error('Passwords do not match');
            return false;
        }

        setLoading(true)
        let data = JSON.stringify({
            "name": name,
            "phone_no": phoneNo,
            "email": email,
            "address": address,
            "gender": gender,
            "address_line1": address,
            "address_line2": address2,
            "city": city,
            "state": state,
            "country": country,
            "password": password,
            "pincode": pincode,
        });
        let config = {
            method: 'Post',
            maxBodyLength: Infinity,
            url: 'teacher/add/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),  
            },
            data: data
        };
        AxiosObj.request(config)
            .then((response) => {
                if (response.data?.Success) {
                    toast.success(capitalizeWords(response.data?.Data[0]) || "Teacher has been added");
                    if (secureLocalStorage.getItem("teacherRAWData")) {
                        secureLocalStorage.removeItem("teacherRAWData")
                    }
                    // Reload the window after 2 seconds
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    setErrorMsg('Something went wrong...!')
                    toast.error(capitalizeWords(response.data?.Data) || "Something went wrong...!");
                }
            })
            .catch((e) => {
                try {
                    e.response.data?.Data.map(item => (
                        toast.error(capitalizeWords(item) || "Something went wrong...!")
                    ))
                } catch (ed) {
                    toast.error(capitalizeWords(e.response.data?.Data) || "Something went wrong...!")
                }
            })
            .finally(() => setLoading(false));

    }

    const SelectField = () => {
        return (
            <FormControl variant="standard" sx={{ width: '100%' }}>
                <Select
                    labelId="gender-simple-select-standard-label"
                    id="gender-simple-select-standard"
                    value={gender}
                    onChange={(e) => { setGender(e.target.value) }}
                    label="Gender"
                >
                    <MenuItem selected value={'Male'}>Male</MenuItem>
                    <MenuItem value={'Female'}>Female</MenuItem>
                    <MenuItem value={"Other"}>Other</MenuItem>
                </Select>
            </FormControl>
        )
    }
    return (
        <div>
            <Dialog maxWidth='md' fullWidth open={open} onClose={handleClose} >
                <DialogTitle variant='h5' >Add Teacher</DialogTitle>
                <DialogContent >
                    <form method='POST'>
                        <Grid container spacing={2} justifyContent='center' alignItems={'center'}>
                            <Grid item lg={3} sm={12}>
                                <Stack margin={2}>
                                    <FormLabel>Name*</FormLabel>
                                    <Input required value={name} onChange={e => setName(e.target.value)} />
                                </Stack>
                            </Grid>
                            <Grid item lg={3} sm={12}>
                                <Stack margin={2}>
                                    <FormLabel>Contact number*</FormLabel>
                                    <Input required type='number' value={phoneNo} onChange={e => setPhoneNo(e.target.value)} />
                                </Stack>
                            </Grid>
                            <Grid item lg={3} sm={12}>
                                <Stack margin={2}>
                                    <FormLabel>Email*</FormLabel>
                                    <Input required type='email' value={email} onChange={e => setEmail(e.target.value)} />
                                </Stack>
                            </Grid>
                            <Grid item lg={3} sm={12}>
                                <Stack margin={2}>
                                    <FormLabel>Gender*</FormLabel>
                                    <SelectField />
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} justifyContent='center' alignItems={'center'}>
                            <Grid item lg={6} sm={12}>
                                <Stack margin={2}>
                                    <FormLabel>Address 1*</FormLabel>
                                    <Input required value={address} onChange={e => setAddress(e.target.value)} />
                                </Stack>
                            </Grid>
                            <Grid item lg={6} sm={12}>
                                <Stack margin={2}>
                                    <FormLabel>Address 2</FormLabel>
                                    <Input value={address2} onChange={e => setAddress2(e.target.value)} />
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} justifyContent='center' alignItems={'center'}>
                            <Grid item lg={3} sm={12}>
                                <Stack margin={2}>
                                    <FormLabel>City*</FormLabel>
                                    <Input required value={city} onChange={e => setCity(e.target.value)} />
                                </Stack>
                            </Grid>
                            <Grid item lg={3} sm={12}>
                                <Stack margin={2}>
                                    <FormLabel>State*</FormLabel>
                                    <Input required value={state} onChange={e => setState(e.target.value)} />
                                </Stack>
                            </Grid>
                            <Grid item lg={3} sm={12}>
                                <Stack margin={2}>
                                    <FormLabel>Country*</FormLabel>
                                    <Input required value={country} onChange={e => setCountry(e.target.value)} />
                                </Stack>
                            </Grid>
                            <Grid item lg={3} sm={12}>
                                <Stack margin={2}>
                                    <FormLabel>Pincode*</FormLabel>
                                    <Input required type='number' value={pincode} onChange={e => setPincode(e.target.value)} />
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} justifyContent='center' alignItems={'center'}>
                            <Grid item lg={6} sm={12}>
                                <Stack margin={2}>
                                    <FormLabel>Password*</FormLabel>
                                    <Input
                                        key={'current_password'}
                                        fullWidth
                                        required
                                        id='current_password'
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        name='current_password'
                                        inputProps={{ style: { textTransform: "none" } }}
                                        onChange={e => setPassword(e.target.value)}
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
                            </Grid>
                            <Grid item lg={6} sm={12}>
                                <Stack margin={2}>
                                    <FormLabel>Confirm Password*</FormLabel>
                                    <Input
                                        key={'current_password'}
                                        fullWidth
                                        required
                                        id='current_password'
                                        type={showPassword ? 'text' : 'password'}
                                        value={cpassword}
                                        name='current_password'
                                        inputProps={{ style: { textTransform: "none" } }}
                                        onChange={e => setCPassword(e.target.value)}
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
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <Typography color='red' textAlign={'center'}>{errorMsg}</Typography>
                <Grid container spacing={2} mt={2} justifyContent='center' alignItems={'center'}>
                    {loading ? <Loader /> : <Button type='submit' variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} onClick={addTeacher} >Add Teacher</Button>}
                </Grid>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
