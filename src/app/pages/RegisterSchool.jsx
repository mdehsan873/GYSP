import { Container, InputAdornment, FormLabel, Grid, Input, Paper, Stack, TextField, Typography, FormControl, MenuItem, Select, Button } from '@mui/material'
import React, { useState } from 'react'
import { IconButton } from '@mui/material';
import Loader from '../components/Loader'
import { getAxiosWithNoToken } from '../axios/AxiosObj'
import Success from '../components/dialogs/Success'
import { toast } from 'react-toastify';
import { useEffect } from 'react'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import * as Yup from 'yup'
import { useFormik } from 'formik';
import secureLocalStorage from 'react-secure-storage';
// The Values

const initialValues = {
    regNo: "",
    name: "",
    contactNo: "",
    email: "",
    board: "",
    schoolLevel: "",
    ownerName: "",
    ownerNo: "",
    website: "",
    address1: "",
    address2: "",
    pin: "",
    city: "",
    country: "",
    schState: "",
    password: "",
    cpassword: "",
}


const RegisterSchool = () => {

    // School Details

    

    const [schoolLogo, setSchoolLogo] = useState('')
    const [image, setImage] = useState(null)

    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [openSuccess, setOpenSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false);

    const [otherBoard, setOtherBoard] = useState('')
    const [otherBoardErr, setOtherBoardErr] = useState('')
    // Validation

    const schoolSchema = Yup.object({
        regNo: Yup.string().required('Registration no. should not be empty'),
        name: Yup.string().required("School Name should not be empty"),
        contactNo: Yup.string().required("Contact Number should not be empty").min(10, "Enter a valid number").max(10, "Enter a vaild number"),
        email: Yup.string().email("Enter the a valid email").required("School's email should not be empty"),
        board: Yup.string().required("Board should not be empty"),
        schoolLevel: Yup.string().required("School level should not be empty"),
        ownerName: Yup.string().required("Principle Name should not be empty").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
        ownerNo: Yup.string().required("Principle Number should not be empty").min(10, "Enter a valid principle number").max(10, "Enter a vaild principle number"),
        website: Yup.string().matches(
            /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
            'Enter correct url!'
        ).required("Website should not be empty"),
        address1: Yup.string().required("Address 1 should not be empty"),
        address2: Yup.string(),
        // pin: Yup.number().required("Pincode should not be empty").min(6, "Enter a valid pincode").max(6, "Enter a valid pincode"),
        pin: Yup.string().required("Pincode should not be empty").test('len', 'Enter a valid pincode', val => val.length === 6),
        city: Yup.string().required("City should not be empty")
            .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
        schState: Yup.string().required("State should not be empty")
            .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
        country: Yup.string().required("Country should not be empty")
            .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
        password: Yup.string().min(6, "Password should have at least 6 characters").max(25).required("Password should not be empty"),
        cpassword: Yup.string().required("Password should not be empty").oneOf([Yup.ref("password")], "Passwords do not match"),
    })

    const handleChangeNew = (e) => {
        const { value, name } = e.target;
        if (e.target.name == "otherBoard") {
            setOtherBoard(e.target.value)
        }
    }

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: initialValues,

        validationSchema: schoolSchema,

        onSubmit: async (values, action) => {
            try {

                setErrorMsg('');

                const formData = new FormData();
                formData.append('name', values.name);
                formData.append('registration_no', values.regNo);
                formData.append('board', values.board);
                formData.append('phone', values.contactNo);
                formData.append('email', values.email);
                formData.append('owner_phone', values.ownerNo);
                formData.append('address_line1', values.address1);
                formData.append('address_line2', values.address2);
                formData.append('city', values.city);
                formData.append('state', values.schState);
                formData.append('country', values.country);
                formData.append('pincode', values.pin);
                formData.append('logo', schoolLogo);
                formData.append('school_level', values.schoolLevel);
                formData.append('website', values.website);
                formData.append('password', values.password);
                formData.append('principle_name', values.ownerName);

                if (values.board == "Other") {
                    formData.board = otherBoard;
                } else {
                    formData.board = values.board;
                }
                if (values.board == "Other") {
                    if (otherBoard == "") {
                        setOtherBoardErr('Board should not be empty')
                        return null;
                    }
                    if (/\d/.test(otherBoard)) {
                        setOtherBoardErr('Board should not contain numbers')
                        return null;
                    }
                }

                // console.log(formData)
                // return null;
                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'account/signup/school/',
                    headers: {
                        "Content-Type": "multipart/form-data",
                        accept: 'application/json'              
        
                    },
                    data: formData
                };

                const AxiosObj = getAxiosWithNoToken();

                setLoading(true)
                AxiosObj.request(config)
                    .then((response) => {
                        if (response.data?.Success) {
                            toast.success("School has been registered");

                            // Reload the window after 2 seconds
                            setOpenSuccess(true);
                            setTimeout(() => {
                                window.location.reload();
                            }, 2500);
                        } else {
                            toast.error(response.data?.Data || "Something went wrong...!");
                        }
                    })
                    .catch((error) => {
                        if (error?.response?.status === 401) {
                            toast.error('Something went wrong...!');
                            return;
                        }

                        if (error?.response?.data?.data) {
                            error.response.data.data.map((item) => {
                                toast.error(item);
                            });
                        } else {
                            toast.error("Something went wrong...!");
                        }
                    })
                    .finally(() => setLoading(false));
            } catch (error) {
                console.log(error)
            }

        }
    })


    const SelectSchoolLevel = () => {
        return (
            <FormControl variant="standard" sx={{ width: '100%' }}>
                <Select
                    labelId="schoollevel"
                    id="schoollevel"
                    value={"" || values.schoolLevel}
                    onChange={handleChange}
                    // onBlur={handleBlur}
                    name='schoolLevel'
                    placeholder="schoolLevel"
                    label="schoollevel"
                >
                    <MenuItem value={'Primary'}>{'Primary'}</MenuItem>
                    <MenuItem value={'Secondary'}>{'Secondary'}</MenuItem>
                    <MenuItem value={'Senior Secondary'}>{'Senior Secondary'}</MenuItem>
                    <MenuItem value={'Other'}>{'Other'}</MenuItem>
                </Select>
                {errors.schoolLevel && touched.schoolLevel ? <p style={{ color: "red", marginBottom: "0px" }}>{errors.schoolLevel}</p> : null}
            </FormControl>
        )
    }

    const handleImage = (event) => {
        if (event.target.files[0]) {
            if (event.target.files[0].type.includes('image')) {
                if (event.target.files[0].size <= 2097152) {
                    const selectedImage = event.target.files[0];
                    const imageUrl = URL.createObjectURL(selectedImage);
                    setSchoolLogo(selectedImage)
                    setImage(imageUrl);
                } else {
                    toast.error("Image Should be not more than 2 MB");
                    setErrorMsg("Image Should be not more than 2 MB");
                }
            } else {
                setErrorMsg("File should be a image");
                toast.error("File should be a image");
            }
        }
    }

    const handleKey = (e) => {
        const { name, value } = e.target;

        if (name == "contactNo") {
            if (e.keyCode === 69) {
                e.preventDefault();
            }
            if (value.length >= 10) {
                // Check if the pressed key is a backspace, delete, or arrow key
                if (e.key === 'Backspace' || e.key === 'Delete' || e.key.includes('Arrow')) {
                    // Allow these keys
                } else {
                    // Prevent typing for other keys
                    e.preventDefault();
                }
            }
        }
        if (name == "ownerNo") {
            if (e.keyCode === 69) {
                e.preventDefault();
            }
            if (value.length >= 10) {
                // Check if the pressed key is a backspace, delete, or arrow key
                if (e.key === 'Backspace' || e.key === 'Delete' || e.key.includes('Arrow')) {
                    // Allow these keys
                } else {
                    // Prevent typing for other keys
                    e.preventDefault();
                }
            }
        }
        if (name == "pin") {
            if (e.keyCode === 69) {
                e.preventDefault();
            }
            if (value.length >= 6) {
                // Check if the pressed key is a backspace, delete, or arrow key
                if (e.key === 'Backspace' || e.key === 'Delete' || e.key.includes('Arrow')) {
                    // Allow these keys
                } else {
                    // Prevent typing for other keys
                    e.preventDefault();
                }
            }
        }
    };

    
   

    return (
        <Container maxWidth='lg' sx={{ backgroundColor: '#f7fafa' }}>
            <Paper sx={{ py: 2 }}>
                <Typography variant='h3' textAlign={'center'}>Register School</Typography>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={1} >
                        <Grid container justifyContent='center' alignItems={'center'}>
                            <Grid item lg={4} xs={12} style={{ height: "112px" }}>
                                <Stack margin={2}>
                                    <FormLabel>School Name*</FormLabel>
                                    <Input
                                        value={"" || values.name}
                                        onChange={handleChange}
                                        // onBlur={handleBlur}
                                        name='name'
                                        inputProps={{ style: { textTransform: "none" } }}
                                        placeholder="School Name"
                                    />
                                    {errors.name && touched.name ? <p style={{ color: "red", marginBottom: "0px" }}>{errors.name}</p> : null}
                                </Stack>
                            </Grid>
                            <Grid item lg={4} xs={12} style={{ height: "112px" }}>
                                <Stack margin={2}>
                                    <FormLabel>Registration Number*</FormLabel>
                                    <Input
                                        value={"" || values.regNo}
                                        onChange={handleChange}
                                        // onBlur={handleBlur}
                                        name='regNo'
                                        inputProps={{ style: { textTransform: "none" } }}
                                        placeholder="Registration Number"
                                    />
                                    {errors.regNo && touched.regNo ? <p style={{ color: "red", marginBottom: "0px" }}>{errors.regNo}</p> : null}
                                </Stack>
                            </Grid>
                            <Grid item lg={4} xs={12} style={{ height: "112px" }}>
                                <Stack margin={2}>
                                    <FormLabel>Contact Number*</FormLabel>
                                    <Input type='number'
                                        value={"" || values.contactNo}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        onKeyDown={(e) => { handleKey(e) }}
                                        name='contactNo'
                                        inputProps={{ style: { textTransform: "none" } }}
                                        placeholder="Contact Number"
                                        maxLength={10} // This will restrict the input to 10 characters
                                    />
                                    {errors.contactNo && touched.contactNo ? <p style={{ color: "red", marginBottom: "0px" }}>{errors.contactNo}</p> : null}
                                </Stack>
                            </Grid>
                        </Grid>

                        <Grid container>
                            <Grid item lg={4} xs={12} style={{ height: "112px" }}>
                                <Stack margin={2}>
                                    <FormLabel>Board*</FormLabel>
                                    {values.board == "Other" ? (

                                        <Grid container gap={3}>
                                            <FormControl variant="standard" sx={{ width: '30%' }}>
                                                <Select
                                                    labelId="board"
                                                    id="board"
                                                    value={"" || values.board}
                                                    onChange={handleChange}
                                                    name='board'
                                                    placeholder="board"
                                                    label="board"
                                                >
                                                    <MenuItem value={'CBSE'}>{'CBSE Board'}</MenuItem>
                                                    <MenuItem value={'ICSE'}>{'ICSE Board'}</MenuItem>
                                                    <MenuItem value={'IB'}>{'IB Board'}</MenuItem>
                                                    <MenuItem value={'CIE'}>{'CIE Board'}</MenuItem>
                                                    <MenuItem value={'Other'}>{'Other'}</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <FormControl variant="standard" sx={{ width: '60%' }}>
                                                <Input
                                                    value={"" || otherBoard}
                                                    onChange={handleChangeNew}
                                                    name='otherBoard'
                                                    inputProps={{ style: { textTransform: "none" } }}
                                                    placeholder="Board Name"
                                                />
                                            </FormControl>

                                        </Grid>
                                    ) : (

                                        <FormControl variant="standard" sx={{ width: '100%' }}>
                                            <Select
                                                labelId="board"
                                                id="board"
                                                value={"" || values.board}
                                                onChange={handleChange}
                                                name='board'
                                                placeholder="board"
                                                label="board"
                                            >
                                                <MenuItem value={'CBSE'}>{'CBSE Board'}</MenuItem>
                                                <MenuItem value={'ICSE'}>{'ICSE Board'}</MenuItem>
                                                <MenuItem value={'IB'}>{'IB Board'}</MenuItem>
                                                <MenuItem value={'CIE'}>{'CIE Board'}</MenuItem>
                                                <MenuItem value={'Other'}>{'Other'}</MenuItem>
                                            </Select>
                                        </FormControl>
                                    )}
                                    {errors.board && touched.board ? <p style={{ color: "red", marginBottom: "0px" }}>{errors.board}</p> : null}
                                    {otherBoardErr ? <p style={{ color: "red", marginBottom: "0px" }}>{otherBoardErr}</p> : null}
                                </Stack>
                            </Grid>
                            <Grid item lg={4} xs={12} style={{ height: "112px" }}>
                                <Stack margin={2} >
                                    <FormLabel>School Level*</FormLabel>
                                    <SelectSchoolLevel />
                                </Stack>
                            </Grid>
                            <Grid item lg={4} xs={12} style={{ height: "112px" }}>
                                <Stack margin={2}>
                                    <FormLabel>School's email*</FormLabel>
                                    <Input
                                        type='email'
                                        value={"" || values.email}
                                        onChange={handleChange}
                                        // onBlur={handleBlur}
                                        name='email'
                                        inputProps={{ style: { textTransform: "none" } }}
                                        placeholder="School email"
                                    />
                                    {errors.email && touched.email ? <p style={{ color: "red", marginBottom: "0px" }}>{errors.email}</p> : null}
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent='center' alignItems={'center'}>
                            <Grid item lg={4} xs={12} style={{ height: "112px" }}>
                                <Stack margin={2}>
                                    <FormLabel>Principle Name*</FormLabel>
                                    <Input
                                        value={"" || values.ownerName}
                                        onChange={handleChange}
                                        // onBlur={handleBlur}
                                        name='ownerName'
                                        inputProps={{ style: { textTransform: "none" } }}
                                        placeholder="Principle Name"
                                    />
                                    {errors.ownerName && touched.ownerName ? <p style={{ color: "red", marginBottom: "0px" }}>{errors.ownerName}</p> : null}
                                </Stack>
                            </Grid>
                            <Grid item lg={4} xs={12} style={{ height: "112px" }}>
                                <Stack margin={2}>
                                    <FormLabel>Principle Number*</FormLabel>
                                    <Input
                                        type='number'
                                        value={"" || values.ownerNo}
                                        onChange={handleChange}
                                        // onBlur={handleBlur}
                                        onKeyDown={(e) => { handleKey(e) }}
                                        name='ownerNo'
                                        inputProps={{ style: { textTransform: "none" } }}
                                        placeholder="Principle Number"
                                    />
                                    {errors.ownerNo && touched.ownerNo ? <p style={{ color: "red", marginBottom: "0px" }}>{errors.ownerNo}</p> : null}
                                </Stack>
                            </Grid>
                            <Grid item lg={4} xs={12} style={{ height: "112px" }}>
                                <Stack margin={2}>
                                    <FormLabel>Website Information</FormLabel>
                                    <Input type='text'
                                        value={"" || values.website}
                                        onChange={handleChange}
                                        // onBlur={handleBlur}
                                        name='website'
                                        inputProps={{ style: { textTransform: "none" } }}
                                        placeholder="Website Information"
                                    />
                                    <FormLabel>{errors.website && touched.website ? <p style={{ color: "red", marginBottom: "0px" }}>{errors.website}</p> : null}</FormLabel>
                                </Stack>
                            </Grid>
                        </Grid>

                        <Grid container>
                            <Grid item list="true" lg={4} xs={12} style={{ height: "112px" }}>
                                <Stack margin={2}>
                                    <FormLabel>Address 1*</FormLabel>
                                    <Input
                                        value={"" || values.address1}
                                        onChange={handleChange}
                                        // onBlur={handleBlur}
                                        name='address1'
                                        inputProps={{ style: { textTransform: "none" } }}
                                        placeholder="Address 1"
                                    />
                                    {errors.address1 && touched.address1 ? <p style={{ color: "red", marginBottom: "0px" }}>{errors.address1}</p> : null}
                                </Stack>
                            </Grid>
                            <Grid item list="true" lg={4} xs={12} style={{ height: "112px" }}>
                                <Stack margin={2}>
                                    <FormLabel>Address 2</FormLabel>
                                    <Input
                                        value={"" || values.address2}
                                        onChange={handleChange}
                                        // onBlur={handleBlur}
                                        name='address2'
                                        inputProps={{ style: { textTransform: "none" } }}
                                        placeholder="Address 2"
                                    />
                                    {errors.address2 && touched.address2 ? <p style={{ color: "red", marginBottom: "0px" }}>{errors.address2}</p> : null}
                                </Stack>
                            </Grid>
                            <Grid item list="true" lg={4} xs={12} style={{ height: "112px" }}>
                                <Stack margin={2}>
                                    <FormLabel>Pincode*</FormLabel>
                                    <Input
                                        value={"" || values.pin}
                                        type='number'
                                        onChange={handleChange}
                                        // onBlur={handleBlur}
                                        onKeyDown={(e) => { handleKey(e) }}
                                        name='pin'
                                        inputProps={{ style: { textTransform: "none" } }}
                                        placeholder="Pincode"
                                    />
                                    {errors.pin && touched.pin ? <p style={{ color: "red", marginBottom: "0px" }}>{errors.pin}</p> : null}
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item list="true" lg={4} xs={12} style={{ height: "112px" }}>
                                <Stack margin={2}>
                                    <FormLabel>City*</FormLabel>
                                    <Input
                                        value={"" || values.city}
                                        onChange={handleChange}
                                        // onBlur={handleBlur}
                                        name='city'
                                        inputProps={{ style: { textTransform: "none" } }}
                                        placeholder="City"
                                    />
                                    {errors.city && touched.city ? <p style={{ color: "red", marginBottom: "0px" }}>{errors.city}</p> : null}
                                </Stack>
                            </Grid>
                            <Grid item list="true" lg={4} xs={12} style={{ height: "112px" }}>
                                <Stack margin={2}>
                                    <FormLabel>State*</FormLabel>
                                    <Input
                                        value={"" || values.schState}
                                        onChange={handleChange}
                                        // onBlur={handleBlur}
                                        name='schState'
                                        inputProps={{ style: { textTransform: "none" } }}
                                        placeholder="State"
                                    />
                                    {errors.schState && touched.schState ? <p style={{ color: "red", marginBottom: "0px" }}>{errors.schState}</p> : null}
                                </Stack>
                            </Grid>
                            <Grid item list="true" lg={4} xs={12} style={{ height: "112px" }}>
                                <Stack margin={2}>
                                    <FormLabel>Country*</FormLabel>
                                    <Input
                                        value={"" || values.country}
                                        onChange={handleChange}
                                        // onBlur={handleBlur}
                                        name='country'
                                        inputProps={{ style: { textTransform: "none" } }}
                                        placeholder="Country"
                                    />
                                    {errors.country && touched.country ? <p style={{ color: "red", marginBottom: "0px" }}>{errors.country}</p> : null}
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid container  >
                            <Grid item lg={4} xs={12} style={{ height: "112px" }}>
                                <Stack margin={2}>
                                    <FormLabel>Password*</FormLabel>
                                    <Input
                                        value={"" || values.password}
                                        type={showPassword ? 'text' : 'password'}
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
                                        onChange={handleChange}
                                        // onBlur={handleBlur}
                                        name='password'
                                        inputProps={{ style: { textTransform: "none" } }}
                                        placeholder="Password"
                                    />
                                    {errors.password && touched.password ? <p style={{ color: "red", marginBottom: "0px" }}>{errors.password}</p> : null}
                                </Stack>
                            </Grid>
                            <Grid item lg={4} xs={12} style={{ height: "112px" }}>
                                <Stack margin={2}>
                                    <FormLabel>Confirm Password*</FormLabel>
                                    <Input
                                        value={"" || values.cpassword}
                                        type={showPassword ? 'text' : 'password'}
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
                                        onChange={handleChange}
                                        // onBlur={handleBlur}
                                        name='cpassword'
                                        inputProps={{ style: { textTransform: "none" } }}
                                        placeholder="Confirm Password"
                                    />
                                    {errors.cpassword && touched.cpassword ? <p style={{ color: "red", marginBottom: "0px" }}>{errors.cpassword}</p> : null}
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item list="true" lg={4} xs={12}>
                                <Stack margin={2}>
                                    <FormLabel>School Logo</FormLabel>
                                    <TextField
                                        type={'file'}
                                        InputProps={{
                                            // Add inner props here
                                            inputProps: {
                                                accept: "image/png, image/jpeg, image/jpg",
                                                style: { color: 'transparent' }
                                            }
                                        }}
                                        onChange={handleImage} />
                                </Stack>
                            </Grid>

                            {image === null ? (<Grid item list="true" lg={4} xs={12}><Stack margin={2}></Stack></Grid>)
                                : (<Grid item list="true" lg={4} xs={12}><Stack margin={2}><img src={image} alt="" /></Stack></Grid>)}
                        </Grid>
                    </Stack>

                    <Typography color='red' textAlign={'center'}>{errorMsg}</Typography>
                    <Stack m={3}>{loading ? <Loader /> : <Button type='submit' variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', textAlign: 'center' }}  >Register</Button>}</Stack>
                </form>
            </Paper>
            {openSuccess ? <Success btnTxt={'Ok'} desc={'username and password will be sent to registered email.'} title={'School registered !'} /> : null}</Container>
    )
}

export default RegisterSchool