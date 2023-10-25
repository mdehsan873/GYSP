import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Divider, FormControl, FormLabel, Grid, Input, MenuItem, Select, Stack, Typography, InputAdornment, IconButton, Paper, Box } from '@mui/material';
import AxiosObj from '../../../axios/AxiosObj';
import { Image } from 'react-bootstrap'
import Loader from '../../Loader';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import * as Yup from 'yup'
import secureLocalStorage from "react-secure-storage";
import { useFormik } from 'formik';
import SearchIcon from '@mui/icons-material/Search';
import { getAxiosWithToken } from "../../../axios/AxiosObj";
import CloseIcon from '@mui/icons-material/Close';
// The Values

let initialValues = {
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNo: "",
    email: "",
    dob: "",
    fatherName: "",
    motherName: "",
    parentNo: "",
    regdNo: "",
    gender: "",
    session: "",
    classID: "",
    addressLine1: "",
    addressLine2: "",
    pincode: "",
    city: "",
    uState: "",
    country: "",
    password: "",
    cpassword: "",
}

export default function AddStudentDialog({ open, setOpen, }) {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [showPassword, setShowPassword] = useState(false);
    const { classAndSection, sessions } = useSelector(state => state.infra)

    const [classFilterArray, setClassFilterArray] = useState([]);

    const handleClose = () => {
        setError('')
        setLoading(false);
        setOpen(false);
        setOpenAddStudent(false);
        setShowPassword(false);
    };

    const handleKeyDown = (e) => {
        const { name, value } = e.target;
        if (name == "phoneNo") {
            if (e.keyCode === 69) {
                e.preventDefault();
            }
        }
    }

    const studentSchema = Yup.object({
        regdNo: Yup.string().required("Registration number should not be empty"),
        firstName: Yup.string().required("First name should not be empty").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
        gender: Yup.string().required("Gender should not be empty"),
        phoneNo: Yup.string().required("Phone Number should not be empty").min(10, "Enter a valid number").max(10, "Enter a vaild number"),
        email: Yup.string().email("Enter the a valid email").required("Email should not be empty"),
        classID: Yup.string().required("Class should not be empty"),
        fatherName: Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
        motherName: Yup.string().required("Mother's name should not be empty").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
        parentNo: Yup.string().required("Parent's Number should not be empty").min(10, "Enter a valid number").max(10, "Enter a vaild number"),
        addressLine1: Yup.string().required("Address Line 1 should not be empty"),
        dob: Yup.string().required("Date of Birth should not be empty"),
        pincode: Yup.string().required("Pincode should not be empty").test('len', 'Enter a valid pincode', val => val.length === 6),
        city: Yup.string().required("City should not be empty").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
        uState: Yup.string().required("State should not be empty").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
        country: Yup.string().required("Country should not be empty").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
        password: Yup.string().required("Password should not be empty").min(6, "Password should have at least 6 characters"),
        cpassword: Yup.string().required("Confirm Password should not be empty").oneOf([Yup.ref("password")], "Passwords do not match"),
    })

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: studentSchema,

        onSubmit: async (values, action) => {
            try {

                setLoading(true)

                const foundItem = await classAndSection.find(item => item.id === values.classID);
                if (!foundItem) {
                    setError('Required field should not be empty');
                    toast.error('Required field should not be empty');
                    return false;
                }

                let data = JSON.stringify({
                    "first_name": values.firstName,
                    "middle_name": values.middleName,
                    "last_name": values.lastName,
                    "gender": values.gender,
                    "father_name": values.fatherName,
                    "mother_name": values.motherName,
                    "phone_no": values.phoneNo,
                    "email": values.email,
                    "registration_no": values.regdNo,
                    "session_id": values.session,
                    "class_id": foundItem.class_id,
                    "section_id": foundItem.section_id,
                    "state": values.uState,
                    "city": values.city,
                    "password": values.password,
                    "pincode": values.pincode,
                    "address_line1": values.addressLine1,
                    "address_line2": values.addressLine2,
                    "country": values.country,
                    "dob": values.dob,
                    "parents_no": values.parentNo,
                });

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'student/add/',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),
                    },
                    data: data
                };

                AxiosObj.request(config)
                    .then((response) => {
                        if (response.data?.Success) {
                            if (secureLocalStorage.getItem("countStudent")) {
                                secureLocalStorage.removeItem("countStudent")
                            }
                            toast.success(response.data.Data[0] || "Student has been added");
                            setTimeout(() => { window.location.reload(); }, 1500);
                        } else {
                            response.data?.Data.map(item => (
                                toast.error(item || "Something went wrong...!")
                            ))
                        }
                    })
                    .catch((e) => {
                        try {
                            e.response.data?.Data.map(item => (
                                toast.error(item || "Something went wrong...!")
                            ))
                        } catch (e) {
                            toast.error(e.response.data?.Data || "Something went wrong...!")
                        }
                    })
                    .finally(() => setLoading(false))

            } catch (error) {
                console.log(error)
            }

        }
    })

    const handleKey = (e) => {
        const { name, value } = e.target;
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];

        if (e.keyCode === 69) {
            e.preventDefault();
            return;
        }

        if ((name === "phoneNo" || name === "parentNo" || name === "pincode") && value.length >= 10) {
            if (!allowedKeys.includes(e.key)) {
                e.preventDefault();
            }
        }

        if (name === "pincode" && value.length >= 6) {
            if (!allowedKeys.includes(e.key)) {
                e.preventDefault();
            }
        }
    };

    useEffect(() => {
        setClassFilterArray([...classAndSection])
    }, [classAndSection]);

    useEffect(() => {
        values.session = sessions[0]?.id
    }, [sessions]);


    useEffect(() => {
        const foundItem2 = sessions.find(item => item.id === values.session);

        let filteredClass = classAndSection.filter((cc) => {
            const classMatch = true;
            return classMatch;
        });
        setClassFilterArray(filteredClass);
    }, [values.session]);

    const SelectField = () => {
        return (
            <FormControl variant="standard" sx={{ width: '100%' }}>
                <Select
                    labelId="gender-simple-select-standard-label"
                    id="gender-simple-select-standard"
                    label="Gender"
                    onChange={handleChange}
                    // onBlur={handleBlur}
                    value={"" || values.gender}
                    name='gender'
                    inputProps={{ style: { textTransform: "none" } }}
                    placeholder="Gender"
                >
                    <MenuItem value={'Male'}>Male</MenuItem>
                    <MenuItem value={'Female'}>Female</MenuItem>
                    <MenuItem value={"Other"}>Other</MenuItem>
                </Select>
            </FormControl>
        )
    }

    const SelectSession = () => {
        return (
            <>
                <FormControl variant="standard" sx={{ width: '100%' }}>
                    <Select
                        labelId="session-simple-select-standard-label"
                        id="session-simple-select-standard"
                        onChange={handleChange}
                        value={"" || values.session}
                        name='session'
                        inputProps={{ style: { textTransform: "none" } }}
                        placeholder="Session"
                    >
                        {sessions.map(item => <MenuItem key={item?.id} value={item?.id}>{item?.name}</MenuItem>)}
                    </Select>
                </FormControl>
            </>
        )
    }

    const SelectClass = () => {
        return (
            <FormControl variant="standard" sx={{ width: '100%' }}>
                <Select
                    labelId="selectClass-simple-select-standard-label"
                    id="selectClass-simple-select-standard"
                    value={"" || values.classID}
                    name='classID'
                    onChange={handleChange}
                    placeholder="Class Section"
                >
                    {classFilterArray.map(item => <MenuItem key={item.id} value={item.id}>{(item?.class_name + " " + item?.section_name).toUpperCase()}</MenuItem>)}
                </Select>
            </FormControl>
        )
    }

    // Search Student
    const [openAddStudent, setOpenAddStudent] = useState(false);
    const [searchStudent, setSearchStudent] = useState('');
    const [searchStudentDetailsRAW, setSearchStudentDetailsRAW] = useState([]);
    const [searchStudentDetails, setSearchStudentDetails] = useState({});

    const handleCloseAddStudent = () => {
        setError('')
        setLoading(false);
        setOpen(true)
        setOpenAddStudent(false);
    };

    const handleChangeSearch = (e) => {
        const { name, value } = e.target
        if (name == "searchUsername") {
            setSearchStudent(value)
        }
    };

    const clearSearchFlied = () => {
        if (searchStudent.length !== 0) {
            setSearchStudentDetailsRAW([]);
            setSearchStudentDetails({});
            setSearchStudent('')
        }
    }

    const getDetailsUser = async (searchStudent) => {
        setSearchStudentDetailsRAW([]);
        setSearchStudentDetails({});
        let searchApiFilter = '';

        if (searchStudent != "") {
            searchApiFilter = `?search=${searchStudent}`
        } else {
            return false;
        }

        let config = {
            method: 'GET',
            maxBodyLength: Infinity,
            url: `student/get/all/${searchApiFilter}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
            },
        };
        const AxiosObj = await getAxiosWithToken();

        const response = await AxiosObj.request(config);
        if (response?.data?.results?.length != undefined && response?.data?.results.length != 0) {
            // Handle the case when 'results' is defined and not empty
            setSearchStudentDetailsRAW(response.data.results);
            setSearchStudentDetails(response.data.results[0]);
        } else {
            setSearchStudentDetailsRAW([]);
            setSearchStudentDetails({});
        }
    }

    useEffect(() => {
        getDetailsUser(searchStudent)
    }, [searchStudent]);

    const openHandleStudent = () => {
        setOpenAddStudent(true)
        setOpen(false)
    }
    const handleOpenStudentDetails = (id, secId) => {
        if (searchStudentDetailsRAW.length != 0 && searchStudent.length != 0) {
            setOpenAddStudent(true)
            setOpen(false)

            let config = {
                method: 'GET',
                maxBodyLength: Infinity,
                url: 'student/get/student/details/' + id + '?change_session_id=' + secId,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
                },
            };
            const AxiosObj = getAxiosWithToken();

            AxiosObj.request(config).then(res => {
                const data = res.data.Data

                // setGender(data.student_details?.gender)
                // setRegistrationNo(data.registration_no)
                // setLastName(data.student_details?.last_name)
                // setMiddleName(data.student_details?.middle_name)
                // setFirstName(data.student_details?.first_name)
                // setEmail(data.student_details?.email)
                // setFatherName(data.student_details?.father_name)
                // setMotherName(data.student_details?.mother_name)
                // setPhoneNo(data.student_details?.phone_no)
                // // setUState(data.student_details?.state)
                // setCity(data.student_details?.city)
                // setPincode(data.student_details?.pincode)
                // setAddressLine1(data.student_details?.address_line1)
                // setAddressLine2(data.student_details?.address_line2)
                // setParentNo(data.student_details?.parents_no)

                values.gender = data.student_details?.gender
                values.regdNo = data.registration_no;
                values.firstName = data.student_details?.first_name;
                values.lastName = data.student_details?.last_name
                values.middleName = data.student_details?.middle_name
                values.email = data.student_details?.email
                values.fatherName = data.student_details?.father_name
                values.motherName = data.student_details?.mother_name
                values.phoneNo = data.student_details?.phone_no
                values.uState = data.student_details?.state
                values.city = data.student_details?.city
                values.pincode = data.student_details?.pincode
                values.country = data.student_details?.country
                values.addressLine1 = data.student_details?.address_line1
                values.addressLine2 = data.student_details?.address_line2
                values.parentNo = data.student_details?.parents_no
                // if (data.student_details?.dob) {
                //     values.dob = formatDate(data.student_details?.dob)
                // }

                // const foundItem = classAndSection.find(item => item.class_name === data.class_name && item.section_name === data.section && item.session_name === data.session);
                // const foundItem2 = sessions.find(item => item.name === data.session);
                // if (foundItem) {
                //     values.classID = foundItem.id
                //     setSelectClass(foundItem.id)
                // }
                // if (foundItem2) {
                //     values.session = foundItem2.id
                //     setSession(foundItem2.id)
                // }
            })
                .catch(e => { console.log('error while fetching student details', e) })

        }

    }

    return (
        <div>
            <Dialog maxWidth='lg' open={open} onClose={handleClose}>
                <Stack margin={2} style={{ marginBottom: 0 }} direction={"row"} alignItems={"center"} justifyContent={"space-between"} >
                    <DialogTitle variant='h5' fontSize={"18px"} >Add Student</DialogTitle>
                    <CloseIcon style={{ border: "0", color: "#000", cursor: "pointer", fontSize: "28px", marginRight: "12px", marginBottom: "10px" }} onClick={handleClose} />
                </Stack>
                <DialogContent sx={{ borderRadius: "21px", padding: "0px 35px 40px 35px" }}>
                    <Stack margin={2} style={{ marginBottom: 0 }} direction={"row"} alignItems={"center"}>
                        <Typography variant='h6' fontSize={"12px"}>Search student with Reportify username</Typography>
                        <FormControl variant="standard" sx={{ width: '292px', margin: "0px 12px", flexDirection: "row", alignItems: "center", borderBottom: "1px solid #BEBEBE" }}>
                            <input value={searchStudent}
                                onChange={handleChangeSearch}
                                name='searchUsername'
                                inputProps={{ style: { textTransform: "none" } }}
                                placeholder="Enter Username" style={{ border: "0", color: "#8180A5", width: "292px" }}
                            />
                            {
                                searchStudent.length == 0 ? (
                                    <SearchIcon style={{ border: "0", color: "#8180A5", }} />) : (
                                    <CloseIcon style={{ border: "0", color: "#8180A5", cursor: "pointer" }} onClick={clearSearchFlied} />
                                )
                            }
                        </FormControl>
                    </Stack>
                    {searchStudentDetailsRAW && searchStudentDetailsRAW.length != 0 && searchStudent.length != 0 && Array.isArray(searchStudentDetailsRAW) && (
                        <Stack margin={2} gap={1} style={{ marginTop: "30px", width: "80%", cursor: "pointer" }} direction={"row"} onClick={() => { handleOpenStudentDetails(searchStudentDetails?.id, searchStudentDetails?.change_session_id) }} >
                            <Paper sx={{ marginTop: 1, border: 1, boxShadow: "0px 3px 6px 0px rgba(0,0,0,0.2)", width: "100%" }}>
                                <Stack margin={1} gap={1} direction={"row"}>
                                    <Stack marginX={2} direction={"column"} sx={{ width: "30%" }} justifyContent={"center"} alignItems={"center"}>
                                        {searchStudentDetails.student_details?.profile_image == "" || searchStudentDetails.student_details?.profile_image == undefined || searchStudentDetails.student_details?.profile_image == null ? (<Image src={require('../../../assets/Images/profile.png')} width={'100'} height={'100'} style={{ borderRadius: "150px" }} />) : (<Image src={"https://cyber-tutor-x-backend.vercel.app/" + searchStudentDetails.student_details?.profile_image} width={'100'} height={'100'} style={{ borderRadius: "150px" }} />)}
                                        <Typography variant='h5' fontSize={"14px"} marginTop={"16px"}>{`${searchStudentDetails.student_details?.first_name || ''} ${searchStudentDetails.student_details?.middle_name || ''} ${searchStudentDetails.student_details?.last_name || ''}`}</Typography>
                                        <Typography variant='h6' fontSize={"10px"} fontWeight={"400"} marginTop={"3px"} color={"#BEBEBE"}>{searchStudentDetails.student_details?.username || ''}</Typography>
                                    </Stack>
                                    <Stack margin={2} direction={"column"} sx={{ width: "70%" }} >
                                        <Box sx={{ display: 'flex', mb: 0.5, width: "100%" }}>
                                            <Typography sx={{ flex: 0.5, fontWeight: 'bold', fontSize: "12px" }} >Father's Name</Typography>
                                            <Typography sx={{ flex: 0.5, color: "#797979", fontSize: "10px" }}>{searchStudentDetails.student_details?.father_name || ''}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', mb: 0.5, width: "100%" }}>
                                            <Typography sx={{ flex: 0.5, fontWeight: 'bold', fontSize: "12px" }} >Mother's Name</Typography>
                                            <Typography sx={{ flex: 0.5, color: "#797979", fontSize: "10px" }}>{searchStudentDetails.student_details?.mother_name || ''}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', mb: 0.5, width: "100%" }}>
                                            <Typography sx={{ flex: 0.5, fontWeight: 'bold', fontSize: "12px" }} >Date of Birth</Typography>
                                            <Typography sx={{ flex: 0.5, color: "#797979", fontSize: "10px" }}>{searchStudentDetails.student_details?.dob || ''}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', mb: 0.5, width: "100%" }}>
                                            <Typography sx={{ flex: 0.5, fontWeight: 'bold', fontSize: "12px" }} >Email ID</Typography>
                                            <Typography sx={{ flex: 0.5, color: "#797979", fontSize: "10px" }}>{searchStudentDetails.student_details?.email || ''}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', mb: 0.5, width: "100%" }}>
                                            <Typography sx={{ flex: 0.5, fontWeight: 'bold', fontSize: "12px" }} >Parent's Mobile</Typography>
                                            <Typography sx={{ flex: 0.5, color: "#797979", fontSize: "10px" }}>{searchStudentDetails.student_details?.phone_no || ''}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', mb: 0.5, width: "100%" }}>
                                            <Typography sx={{ flex: 0.5, fontWeight: 'bold', fontSize: "12px" }} >Previous School</Typography>
                                            <Typography sx={{ flex: 0.5, color: "#797979", fontSize: "10px" }}>{searchStudentDetails.school_details?.name || ''}</Typography>
                                        </Box>
                                    </Stack>
                                </Stack>
                            </Paper>
                        </Stack>
                    )}
                    <Stack margin={2} gap={1} style={{ marginTop: "30px" }} direction={"row"}>
                        <Typography variant='h6' fontSize={"12px"}>Not registered with Reportify?</Typography>
                        <Typography variant='h6' fontSize={"12px"} color={"#1A73E8"} style={{ cursor: "pointer" }} onClick={openHandleStudent}>REGESTER NOW!</Typography>
                    </Stack>
                </DialogContent>
            </Dialog>
            <Dialog maxWidth='lg' open={openAddStudent} onClose={handleCloseAddStudent} >
                <DialogTitle variant='h5' >Add Student</DialogTitle>
                <Divider />
                <DialogContent >
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2} >
                            <Grid container justifyContent='center' alignItems={'flex-start'} style={{ height: "90px" }}>
                                <Grid item lg={3} xs={12}>
                                    <Stack margin={2} style={{ marginBottom: 0 }} >
                                        <FormLabel>First Name*</FormLabel>
                                        <Input
                                            value={"" || values.firstName}
                                            onChange={handleChange}
                                            name='firstName'
                                            inputProps={{ style: { textTransform: "none" } }}
                                            placeholder="First Name"
                                        />
                                        {errors.firstName && touched.firstName ? <p style={{ color: "red", marginBottom: "0px", fontSize: "10px" }}>{errors.firstName}</p> : null}
                                    </Stack>
                                </Grid>
                                <Grid item lg={3} xs={12}>
                                    <Stack margin={2} style={{ marginBottom: 0 }} >
                                        <FormLabel>Middle Name</FormLabel>
                                        <Input
                                            value={"" || values.middleName}
                                            onChange={handleChange}
                                            name='middleName'
                                            inputProps={{ style: { textTransform: "none" } }}
                                            placeholder="Middle Name"
                                        />
                                        {errors.middleName && touched.middleName ? <p style={{ color: "red", marginBottom: "0px", fontSize: "10px" }}>{errors.middleName}</p> : null}
                                    </Stack>
                                </Grid>
                                <Grid item lg={3} xs={12}>
                                    <Stack margin={2} style={{ marginBottom: 0 }} >
                                        <FormLabel>Last Name</FormLabel>
                                        <Input
                                            value={"" || values.lastName}
                                            onChange={handleChange}
                                            name='lastName'
                                            inputProps={{ style: { textTransform: "none" } }}
                                            placeholder="Last Name"
                                        />
                                        {errors.lastName && touched.lastName ? <p style={{ color: "red", marginBottom: "0px", fontSize: "10px" }}>{errors.lastName}</p> : null}
                                    </Stack>
                                </Grid>
                                <Grid item lg={3} xs={12}>
                                    <Stack margin={2} style={{ marginBottom: 0 }} >
                                        <FormLabel>Gender*</FormLabel>
                                        <SelectField />
                                        {errors.gender && touched.gender ? <p style={{ color: "red", marginBottom: "0px", fontSize: "10px" }}>{errors.gender}</p> : null}
                                    </Stack>
                                </Grid>
                            </Grid>
                            <Grid container justifyContent='center' alignItems={'flex-start'} style={{ height: "90px" }}>
                                <Grid item lg={3} xs={12}>
                                    <Stack margin={2} style={{ marginBottom: 0 }} >
                                        <FormLabel>Phone Number*</FormLabel>
                                        <Input
                                            type='number'
                                            onKeyDown={(e) => { handleKey(e) }}
                                            value={"" || values.phoneNo}
                                            onChange={handleChange}
                                            name='phoneNo'
                                            inputProps={{ style: { textTransform: "none" } }}
                                            placeholder="91XXXXXXXX"
                                        />
                                        {errors.phoneNo && touched.phoneNo ? <p style={{ color: "red", marginBottom: "0px", fontSize: "10px" }}>{errors.phoneNo}</p> : null}
                                    </Stack>
                                </Grid>
                                <Grid item lg={3} xs={12}>
                                    <Stack margin={2} style={{ marginBottom: 0 }} >
                                        <FormLabel>Email*</FormLabel>
                                        <Input
                                            type='email'
                                            value={"" || values.email}
                                            onChange={handleChange}
                                            name='email'
                                            inputProps={{ style: { textTransform: "none" } }}
                                            placeholder="reportify@gmail.com"
                                        />
                                        {errors.email && touched.email ? <p style={{ color: "red", marginBottom: "0px", fontSize: "10px" }}>{errors.email}</p> : null}
                                    </Stack>
                                </Grid>
                                <Grid item lg={3} xs={12}>
                                    <Stack margin={2} style={{ marginBottom: 0 }} >
                                        <FormLabel>Session*</FormLabel>
                                        <SelectSession />
                                        {errors.session && touched.session ? <p style={{ color: "red", marginBottom: "0px", fontSize: "10px" }}>{errors.session}</p> : null}
                                    </Stack>
                                </Grid>
                                <Grid item lg={3} xs={12}>
                                    <Stack margin={2} style={{ marginBottom: 0 }} >
                                        <FormLabel>Class*</FormLabel>
                                        <SelectClass />
                                        {errors.classID && touched.classID ? <p style={{ color: "red", marginBottom: "0px", fontSize: "10px" }}>{errors.classID}</p> : null}
                                    </Stack>
                                </Grid>
                            </Grid>

                            <Grid container justifyContent='center' alignItems={'flex-start'} style={{ height: "90px" }}>
                                <Grid item lg={6} xs={12}>
                                    <Stack margin={2} style={{ marginBottom: 0 }} >
                                        <FormLabel>Father's Name*</FormLabel>
                                        <Input
                                            value={"" || values.fatherName}
                                            onChange={handleChange}
                                            name='fatherName'
                                            inputProps={{ style: { textTransform: "none" } }}
                                            placeholder="Father's Name"
                                        />
                                        {errors.fatherName && touched.fatherName ? <p style={{ color: "red", marginBottom: "0px", fontSize: "10px" }}>{errors.fatherName}</p> : null}
                                    </Stack>
                                </Grid><Grid item lg={6} xs={12}>
                                    <Stack margin={2} style={{ marginBottom: 0 }} >
                                        <FormLabel>Mother's Name*</FormLabel>
                                        <Input
                                            value={"" || values.motherName}
                                            onChange={handleChange}
                                            name='motherName'
                                            inputProps={{ style: { textTransform: "none" } }}
                                            placeholder="Mother's Name"
                                        />
                                        {errors.motherName && touched.motherName ? <p style={{ color: "red", marginBottom: "0px", fontSize: "10px" }}>{errors.motherName}</p> : null}
                                    </Stack>
                                </Grid>
                            </Grid>

                            <Grid container justifyContent='center' alignItems={'flex-start'} style={{ height: "90px" }}>
                                <Grid item lg={6} xs={12}>
                                    <Stack margin={2} style={{ marginBottom: 0 }} >
                                        <FormLabel>Parent's Contact Number*</FormLabel>
                                        <Input
                                            type='number'
                                            onKeyDown={(e) => { handleKey(e) }}
                                            value={"" || values.parentNo}
                                            onChange={handleChange}
                                            name='parentNo'
                                            inputProps={{ style: { textTransform: "none" } }}
                                            placeholder="Parent's Number"
                                        />
                                        {errors.parentNo && touched.parentNo ? <p style={{ color: "red", marginBottom: "0px", fontSize: "10px" }}>{errors.parentNo}</p> : null}
                                    </Stack>
                                </Grid>
                                <Grid item lg={6} xs={12}>
                                    <Stack margin={2} style={{ marginBottom: 0 }} >
                                        <FormLabel>Student DOB*</FormLabel>
                                        <Input
                                            sx={{ display: 'block' }}
                                            type='date'
                                            value={"" || values.dob}
                                            onChange={handleChange}
                                            name='dob'
                                            inputProps={{ style: { textTransform: "none" } }}
                                            placeholder="20-05-2000"
                                        />
                                        {errors.dob && touched.dob ? <p style={{ color: "red", marginBottom: "0px", fontSize: "10px" }}>{errors.dob}</p> : null}
                                    </Stack>
                                </Grid>
                            </Grid>
                            <Grid container alignItems={'flex-start'} style={{ height: "90px" }}>
                                <Grid item lg={4} xs={12}>
                                    <Stack margin={2} style={{ marginBottom: 0 }} >
                                        <FormLabel>Registration Number*</FormLabel>
                                        <Input
                                            value={"" || values.regdNo}
                                            onChange={handleChange}
                                            name='regdNo'
                                            inputProps={{ style: { textTransform: "none" } }}
                                            placeholder="Registration Number"
                                        />
                                        {errors.regdNo && touched.regdNo ? <p style={{ color: "red", marginBottom: "0px", fontSize: "10px" }}>{errors.regdNo}</p> : null}
                                    </Stack>
                                </Grid>

                                <Grid item lg={4} xs={12}>
                                    <Stack margin={2} style={{ marginBottom: 0 }} >
                                        <FormLabel>Address Line 1*</FormLabel>
                                        <Input
                                            value={"" || values.addressLine1}
                                            onChange={handleChange}
                                            name='addressLine1'
                                            inputProps={{ style: { textTransform: "none" } }}
                                            placeholder="Address Line 1"
                                        />
                                        {errors.addressLine1 && touched.addressLine1 ? <p style={{ color: "red", marginBottom: "0px", fontSize: "10px" }}>{errors.addressLine1}</p> : null}
                                    </Stack>
                                </Grid>
                                <Grid item lg={4} xs={12}>
                                    <Stack margin={2} style={{ marginBottom: 0 }} >
                                        <FormLabel>Address Line 2</FormLabel>
                                        <Input
                                            value={"" || values.addressLine2}
                                            onChange={handleChange}
                                            name='addressLine2'
                                            inputProps={{ style: { textTransform: "none" } }}
                                            placeholder="Address Line 2"
                                        />
                                        {errors.addressLine2 && touched.addressLine2 ? <p style={{ color: "red", marginBottom: "0px", fontSize: "10px" }}>{errors.addressLine2}</p> : null}
                                    </Stack>
                                </Grid>

                            </Grid>

                            <Grid container alignItems={'flex-start'} style={{ height: "90px" }} >
                                <Grid item lg={3} xs={12}>
                                    <Stack margin={2} style={{ marginBottom: 0 }} >
                                        <FormLabel>City*</FormLabel>
                                        <Input
                                            value={"" || values.city}
                                            onChange={handleChange}
                                            name='city'
                                            inputProps={{ style: { textTransform: "none" } }}
                                            placeholder="City"
                                        />
                                        {errors.city && touched.city ? <p style={{ color: "red", marginBottom: "0px", fontSize: "10px" }}>{errors.city}</p> : null}
                                    </Stack>
                                </Grid>
                                <Grid item lg={3} xs={12}>
                                    <Stack margin={2} style={{ marginBottom: 0 }} >
                                        <FormLabel>State*</FormLabel>
                                        <Input
                                            value={"" || values.uState}
                                            onChange={handleChange}
                                            name='uState'
                                            inputProps={{ style: { textTransform: "none" } }}
                                            placeholder="State"
                                        />
                                        {errors.uState && touched.uState ? <p style={{ color: "red", marginBottom: "0px", fontSize: "10px" }}>{errors.uState}</p> : null}
                                    </Stack>
                                </Grid>
                                <Grid item lg={3} xs={12}>
                                    <Stack margin={2} style={{ marginBottom: 0 }} >
                                        <FormLabel>Country*</FormLabel>
                                        <Input
                                            value={"" || values.country}
                                            onChange={handleChange}
                                            name='country'
                                            inputProps={{ style: { textTransform: "none" } }}
                                            placeholder="Country"
                                        />
                                        {errors.country && touched.country ? <p style={{ color: "red", marginBottom: "0px", fontSize: "10px" }}>{errors.country}</p> : null}
                                    </Stack>
                                </Grid>
                                <Grid item lg={3} xs={12}>
                                    <Stack margin={2} style={{ marginBottom: 0 }} >
                                        <FormLabel>Pincode*</FormLabel>
                                        <Input
                                            type='number'
                                            onKeyDown={(e) => { handleKey(e) }}
                                            value={"" || values.pincode}
                                            onChange={handleChange}
                                            name='pincode'
                                            inputProps={{ style: { textTransform: "none" } }}
                                            placeholder="pincode"
                                        />
                                        {errors.pincode && touched.pincode ? <p style={{ color: "red", marginBottom: "0px", fontSize: "10px" }}>{errors.pincode}</p> : null}
                                    </Stack>
                                </Grid>
                            </Grid>
                            <Grid container alignItems={'flex-start'} style={{ height: "90px" }}>
                                <Grid item lg={6} xs={12}>
                                    <Stack margin={2} style={{ marginBottom: 0 }} >
                                        <FormLabel>Password*</FormLabel>
                                        <Input
                                            key={'password'}
                                            fullWidth
                                            id='password'
                                            inputProps={{ style: { textTransform: "none" } }}
                                            type={showPassword ? 'text' : 'password'}
                                            onKeyDown={handleKeyDown}
                                            value={"" || values.password}
                                            onChange={handleChange}
                                            name='password'
                                            placeholder="******"
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
                                        {errors.password && touched.password ? <p style={{ color: "red", marginBottom: "0px", fontSize: "10px" }}>{errors.password}</p> : null}
                                    </Stack>
                                </Grid>
                                <Grid item lg={6} xs={12}>
                                    <Stack margin={2} style={{ marginBottom: 0 }} >
                                        <FormLabel>Confirm Password*</FormLabel>
                                        <Input
                                            key={'cpassword'}
                                            fullWidth
                                            id='cpassword'
                                            inputProps={{ style: { textTransform: "none" } }}
                                            type={showPassword ? 'text' : 'password'}
                                            onKeyDown={handleKeyDown}
                                            value={"" || values.cpassword}
                                            onChange={handleChange}
                                            name='cpassword'
                                            placeholder="******"
                                            endAdornment={
                                                <InputAdornment position='end'>
                                                    <IconButton
                                                        aria-label='toggle cpassword visibility'
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
                                        {errors.cpassword && touched.cpassword ? <p style={{ color: "red", marginBottom: "0px", fontSize: "10px" }}>{errors.cpassword}</p> : null}
                                    </Stack>
                                </Grid>

                            </Grid>
                        </Stack>
                        <DialogActions>
                            {error !== '' ? <Typography textAlign={'center'} color={'red'}>{error}</Typography> : null}
                            {loading ? <Loader /> : <Button type='submit' variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} >Add Student</Button>}
                        </DialogActions>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddStudent}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
