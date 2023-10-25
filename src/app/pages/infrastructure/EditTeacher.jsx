import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FormLabel, Typography, Grid, Input, Stack } from '@mui/material';
import Loader from '../../components/Loader';
import { useState } from 'react';
import AxiosObj from '../../axios/AxiosObj';
import { FormControl } from '@mui/material';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import { useEffect } from 'react';
import secureLocalStorage from "react-secure-storage";
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import AlertDialog from '../../components/dialogs/confimationBox';

export default function EditTeacher({ open, setOpen, id }) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [gender, setGender] = useState('')
    const [loading, setLoading] = useState(false)
    const [phoneNo, setPhoneNo] = useState('')
    const [address, setAddress] = useState('')
    const [address2, setAddress2] = useState('')
    const [state, setState] = useState('')
    const [city, setCity] = useState('')
    const [country, setCountry] = useState('')
    const [pincode, setPincode] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    // Delete
    const [isChange, setIsChange] = useState(false)
    const [openDeleteAlert, setOpenDeleteAlert] = useState(false)
    const [deleteData, setDeleteData] = useState("")

    const handleDeleteOpen = (apiEndPoint) => {
        setOpenDeleteAlert(true);
        setDeleteData({
            "apiEndPoint": apiEndPoint,
            "apiData": undefined
        })
    };
    const capitalizeWords = (str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const handleClose = () => {
        setName('')
        setEmail('')
        setGender('')
        setPhoneNo('')
        setAddress('')
        setAddress2('')
        setState('')
        setCountry('')
        setPincode('')
        setErrorMsg('')
        setOpen(false);
        setIsChange(false);
    };

    const editTeacher = async (e) => {

        e.preventDefault();
        if (name == '' || phoneNo == '' || email == '' || address == '' || gender == '' || city == '' || state == '' || country == '' || pincode == '') {
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
        
        if (pincode.length !== 6) {
            setErrorMsg('Enter a valid pin code');
            toast.error('Enter a valid pin code');
            return false;
        }
        
        setErrorMsg('')
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
            "pincode": pincode,
        });

        setLoading(true)
        let config = {
            method: 'patch',
            maxBodyLength: Infinity,
            url: 'teacher/edit/teacher/' + id,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),  
            },
            data: data
        };
        AxiosObj.request(config)
            .then((response) => {
                if (response.data?.Success) {
                    toast.success(capitalizeWords(response.data?.data) || "Teacher has been updated");
                    if (secureLocalStorage.getItem("teacherRAWData")) {
                        secureLocalStorage.removeItem("teacherRAWData")
                    }
                    // Reload the window after 2 seconds
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    toast.error(capitalizeWords(response.data?.data) || "Something went wrong...!");
                }
            })
            .catch((e) => {
                try {
                    e.response.data?.data.map(item => (
                        toast.error(capitalizeWords(item) || "Something went wrong...!")
                    ))
                } catch (ew) {
                    toast.error(capitalizeWords(e.response.data?.data) || "Something went wrong...!")
                    setErrorMsg(capitalizeWords(e.response.data?.data) || "Something went wrong...!")
                }
            })
            .finally(() => setLoading(false));

    }

    // Change 
    const handleChangeValue = (e) => {
        setIsChange(true);
        const { name, value } = e.target;

        if (name === "gender") {
            setGender(value);
        }
        if (name === "name") {
            setName(value);
        }
        if (name === "phoneNo") {
            setPhoneNo(value);
        }
        if (name === "email") {
            setEmail(value);
        }
        if (name === "address") {
            setAddress(value);
        }
        if (name === "address2") {
            setAddress2(value);
        }
        if (name === "city") {
            setCity(value);
        }
        if (name === "state") {
            setState(value);
        }
        if (name === "country") {
            setCountry(value);
        }
        if (name === "pincode") {
            setPincode(value);
        }
    };

    useEffect(() => {
        if (open && open === true) {
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'teacher/get/details/' + id,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
                },
            };
            AxiosObj.request(config).then(res => {
                    const data = res.data.Data.teacher_details
                    setName(data?.name)
                    setPhoneNo(data?.phone_no)
                    setEmail(data?.email)
                    setGender(data?.gender)
                    setAddress(data?.address_line1)
                    setAddress2(data?.address_line2)
                    setCity(data?.city)
                    setState(data?.state)
                    setCountry(data?.country)
                    setPincode(data?.pincode)
                })
                .catch()
        }
    }, [open, id])

    const SelectField = () => {
        return (
            <FormControl variant="standard" sx={{ width: '100%' }}>
                <Select
                    labelId="gender-simple-select-standard-label"
                    id="gender-simple-select-standard"
                    value={gender}
                    name="gender"
                    onChange={handleChangeValue}
                    label="Gender"
                >
                    <MenuItem value={'Male'}>Male</MenuItem>
                    <MenuItem value={'Female'}>Female</MenuItem>
                    <MenuItem value={"Other"}>Other</MenuItem>
                </Select>
            </FormControl>
        )
    }
    return (
        <div>
            <Dialog maxWidth='md' fullWidth open={open} onClose={handleClose} >
                <DialogTitle variant='h5' style={{ display: "flex", justifyContent: "space-between" }} >Edit Teacher <DeleteIcon style={{ color: "red",cursor:"pointer" }} onClick={() => handleDeleteOpen(`teacher/delete/teacher/${id}`)} /></DialogTitle>
                <DialogContent >
                    <form  >
                        <Grid container spacing={2} justifyContent='center' alignItems={'center'}>
                            <Grid item lg={3} sm={12}>
                                <Stack margin={2}>
                                    <FormLabel>Name*</FormLabel>
                                    <Input value={name} name="name" onChange={handleChangeValue} />
                                </Stack>
                            </Grid>
                            <Grid item lg={3} sm={12}>
                                <Stack margin={2}>
                                    <FormLabel>Contact number*</FormLabel>
                                    <Input name="phoneNo" type='number' value={phoneNo} onChange={handleChangeValue} />
                                </Stack>
                            </Grid>
                            <Grid item lg={3} sm={12}>
                                <Stack margin={2}>
                                    <FormLabel>Email*</FormLabel>
                                    <Input name="email" type='email' value={email} onChange={handleChangeValue} />
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
                                    <Input name="address" value={address} onChange={handleChangeValue} />
                                </Stack>
                            </Grid>
                            <Grid item lg={6} sm={12}>
                                <Stack margin={2}>
                                    <FormLabel>Address 2</FormLabel>
                                    <Input name="address2" value={address2} onChange={handleChangeValue} />
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} justifyContent='center' alignItems={'center'}>
                            <Grid item lg={3} sm={12}>
                                <Stack margin={2}>
                                    <FormLabel>City*</FormLabel>
                                    <Input name="city" value={city} onChange={handleChangeValue} />
                                </Stack>
                            </Grid>
                            <Grid item lg={3} sm={12}>
                                <Stack margin={2}>
                                    <FormLabel>State*</FormLabel>
                                    <Input name="state" value={state} onChange={handleChangeValue} />
                                </Stack>
                            </Grid>
                            <Grid item lg={3} sm={12}>
                                <Stack margin={2}>
                                    <FormLabel>Country*</FormLabel>
                                    <Input name="country" value={country} onChange={handleChangeValue} />
                                </Stack>
                            </Grid>
                            <Grid item lg={3} sm={12}>
                                <Stack margin={2}>
                                    <FormLabel>Pincode*</FormLabel>
                                    <Input name="pincode" type='number' value={pincode} onChange={handleChangeValue} />
                                </Stack>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <Typography color='red' textAlign={'center'}>{errorMsg}</Typography>
                {loading ? <Loader /> : <Button disabled={!isChange} variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} onClick={editTeacher} >Update</Button>}
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <AlertDialog openBox={openDeleteAlert} setOpen={setOpenDeleteAlert} data={deleteData} />
        </div>
    )
}
