import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Divider, FormControl, FormLabel, Grid, Input, MenuItem, Select, Stack, Typography, InputAdornment, IconButton } from '@mui/material';
import AxiosObj from '../../../axios/AxiosObj';
import Loader from '../../Loader';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import * as Yup from 'yup'
import { getAxiosWithToken } from "../../../axios/AxiosObj";
import { useFormik } from 'formik';
import AlertDialog from '../confimationBox';
import secureLocalStorage from "react-secure-storage";
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

export default function AddStudentDialog({ open, setOpen, id, secId }) {

    function formatDate(inputDate) {
        // Convert the inputDate string to a Date object
        const dateObject = new Date(inputDate);

        // Extract year, month, and day components
        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Month is zero-based
        const day = String(dateObject.getDate()).padStart(2, '0');

        // Construct the formatted date string
        const formattedDate = `${year}-${month}-${day}`;

        return formattedDate;
    }

    const [gender, setGender] = useState('');
    const [session, setSession] = useState('');
    const [selectClass, setSelectClass] = useState('');
    const [firstName, setFirstName] = useState('')
    const [middleName, setMiddleName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [fatherName, setFatherName] = useState('')
    const [motherName, setMotherName] = useState('')
    const [phoneNo, setPhoneNo] = useState('')
    const [registrationNo, setRegistrationNo] = useState('')
    const [parentNo, setParentNo] = useState('')

    const [addressLine1, setAddressLine1] = useState('')
    const [addressLine2, setAddressLine2] = useState('')
    const [uState, setUState] = useState('')
    const [city, setCity] = useState('')
    const [pincode, setPincode] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const { classAndSection, sessions } = useSelector(state => state.infra)

    const [classFilterArray, setClassFilterArray] = useState([]);
    const [isChange, setIsChange] = useState(false)
    const [openDeleteAlert, setOpenDeleteAlert] = useState(false)
    const [deleteData, setDeleteData] = useState("")

    const handleClose = () => {
        setError('')
        initialValues = {
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
        // setGender('')
        // setSession('')
        // setClassID('')
        // setMiddleName('')
        // setLastName('')
        // setFatherName('')
        // setMotherName('')
        // setRegdNo('')
        // setPhoneNo('')
        // setUState('')
        // setAddressLine1('')
        // setCPassword('')
        // setPassword('')
        // setEmail('')
        // setPincode('')
        // setDob('')
        // setCountry('')
        // setAddressLine2('')
        // setParentNo('')
        // setCity('')
        setLoading(false);
        setOpen(false);
        setOpenDeleteAlert(false)
        setIsChange(false)
        setDeleteData('')
        setGender('')
        setMiddleName('')
        setSession('')
        setSelectClass('')
        setFirstName('')
        setLastName('')
        setEmail('')
        setFatherName('')
        setMotherName('')
        setPhoneNo('')
        setRegistrationNo('')
        setLoading('')
        setCity('')
        setPincode('')
    };

    const studentSchema = Yup.object({
        regdNo: Yup.string().required("Registration number should not be empty"),
        firstName: Yup.string().required("First name should not be empty").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
        gender: Yup.string().required("Gender should not be empty"),
        phoneNo: Yup.string().required("Phone Number should not be empty").min(10, "Enter a valid number").max(10, "Enter a vaild number"),
        email: Yup.string().email("Enter the a valid email").required("Email should not be empty"),
        classID: Yup.string().required("Class should not be empty"),
        fatherName: Yup.string().required("Father's name should not be empty").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
        motherName: Yup.string().required("Mother's name should not be empty").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
        parentNo: Yup.string().required("Parent's Number should not be empty").min(10, "Enter a valid number").max(10, "Enter a vaild number"),
        addressLine1: Yup.string().required("Address Line 1 should not be empty"),
        dob: Yup.string().required("Date of Birth should not be empty"),
        pincode: Yup.string().required("Pincode should not be empty").test('len', 'Enter a valid pincode', val => val.length === 6),
        city: Yup.string().required("City should not be empty").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
        uState: Yup.string().required("State should not be empty").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
        country: Yup.string().required("Country should not be empty").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
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

                let data = {
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
                };

                // if (values.firstName !== firstName) {
                //     data.first_name = values.firstName
                // }
                // if (values.middleName !== middleName) {
                //     data.middle_name = values.middleName
                // }
                // if (values.lastName !== lastName) {
                //     data.last_name = values.lastName
                // }
                // if (values.lastName !== lastName) {
                //     data.last_name = values.lastName
                // }


                let config = {
                    method: 'PATCH',
                    maxBodyLength: Infinity,
                    url: 'student/edit/' + id + '/',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
                    },
                    data: JSON.stringify(data)
                };

                AxiosObj.request(config)
                    .then((response) => {
                        if (response.data?.Success) {
                            toast.success(response.data.Data[0] || "Student has been updated");
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

        setIsChange(true)

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
            const classMatch = foundItem2?.name === 'all' || cc.session_name === foundItem2?.name;
            return classMatch;
        });
        setClassFilterArray(filteredClass);
    }, [values.session]);


    const fetchStudent = async () => {
        if (id !== 0 && secId !== 0) {

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

                setGender(data.student_details?.gender)
                setRegistrationNo(data.registration_no)
                setLastName(data.student_details?.last_name)
                setMiddleName(data.student_details?.middle_name)
                setFirstName(data.student_details?.first_name)
                setEmail(data.student_details?.email)
                setFatherName(data.student_details?.father_name)
                setMotherName(data.student_details?.mother_name)
                setPhoneNo(data.student_details?.phone_no)
                setUState(data.student_details?.state)
                setCity(data.student_details?.city)
                setPincode(data.student_details?.pincode)
                setAddressLine1(data.student_details?.address_line1)
                setAddressLine2(data.student_details?.address_line2)
                setParentNo(data.student_details?.parents_no)

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
                if (data.student_details?.dob) {
                    values.dob = formatDate(data.student_details?.dob)
                }

                const foundItem = classAndSection.find(item => item.class_name === data.class_name && item.section_name === data.section && item.session_name === data.session);
                const foundItem2 = sessions.find(item => item.name === data.session);
                if (foundItem) {
                    values.classID = foundItem.id
                    setSelectClass(foundItem.id)
                }
                if (foundItem2) {
                    values.session = foundItem2.id
                    setSession(foundItem2.id)
                }
            })
                .catch(e => { console.log('error while fetching student details', e) })
        } else {
            setOpen(false);
        }
    }

    useEffect(() => {
        if (open && open === true) {
            fetchStudent()
        }
    }, [id, open])

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
                    onKeyDown={(e) => { handleKey(e) }}
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
                        onKeyDown={(e) => { handleKey(e) }}
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
                    onKeyDown={(e) => { handleKey(e) }}
                    placeholder="Class Section"
                >
                    {classFilterArray.map(item => <MenuItem key={item.id} value={item.id}>{(item?.class_name + " " + item?.section_name).toUpperCase()}</MenuItem>)}
                </Select>
            </FormControl>
        )
    }
    const handleDeleteOpen = (apiEndPoint) => {
        setOpenDeleteAlert(true);
        setDeleteData({
            "apiEndPoint": apiEndPoint,
            "apiData": undefined
        })
    };

    return (
        <div>
            <Dialog maxWidth='lg' open={open} onClose={handleClose} >
                <DialogTitle variant='h5' style={{ display: "flex", justifyContent: "space-between" }} >Update Student <DeleteIcon style={{ color: "red" }} onClick={() => handleDeleteOpen(`student/delete/${id}/`)} /></DialogTitle>
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
                                            onKeyDown={(e) => { handleKey(e) }}
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
                                            onKeyDown={(e) => { handleKey(e) }}
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
                                            onKeyDown={(e) => { handleKey(e) }}
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
                                            onKeyDown={(e) => { handleKey(e) }}
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
                                            onKeyDown={(e) => { handleKey(e) }}
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
                                            onKeyDown={(e) => { handleKey(e) }}
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
                                            onKeyDown={(e) => { handleKey(e) }}
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
                                            onKeyDown={(e) => { handleKey(e) }}
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
                                            onKeyDown={(e) => { handleKey(e) }}
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
                                            onKeyDown={(e) => { handleKey(e) }}
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
                                            onKeyDown={(e) => { handleKey(e) }}
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
                                            onKeyDown={(e) => { handleKey(e) }}
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
                                            onKeyDown={(e) => { handleKey(e) }}
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
                        </Stack>
                        <DialogActions>
                            {error !== '' ? <Typography textAlign={'center'} color={'red'}>{error}</Typography> : null}
                            {loading ? <Loader /> : <Button disabled={!isChange} type='submit' variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} >Update Student</Button>}
                        </DialogActions>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <AlertDialog openBox={openDeleteAlert} setOpen={setOpenDeleteAlert} data={deleteData} />
        </div>
    )
}
