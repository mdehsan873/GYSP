import { Box, Card, Container, Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material'
import React, { useState } from 'react'
import InfoBox from '../../components/InfoBox'
import { Edit } from '@mui/icons-material'
import { useEffect } from 'react'
import { Image } from 'react-bootstrap'
import AxiosObj from '../../axios/AxiosObj'
import BackLink from './backBtn';
import Loader from '../../components/Loader'
import EditBox from './EditBox'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import { useSelector } from "react-redux"
import ChangePasword from '../../components/ChangePasswordDialog'
import EditAddress from '../../components/dialogs/EditAddress'
import FullName from '../../components/dialogs/FullName'
import EditSchoolLogo from "./EditSchoolILogo";

export const StudentProfile = () => {

    const { studentDetails } = useSelector(state => state.infra)
    const [Open, setOpen] = useState(false)
    const [studentDOB, setStudentDOB] = useState('')
    const [loading, setLoading] = useState(false)
    const mob = useMediaQuery('(max-width:800px)')

    // Edit Detials
    const [editNameDetails, setEditNameDetails] = useState('')
    const [openEditNameBox, setOpenEditNameBox] = useState(false);

    const handleNameEditDetails = (firstName, middleName, lastName, type) => {
        setEditNameDetails({
            "apiEndPoint": "student/update/student_details/",
            "firstName": firstName,
            "middleName": middleName,
            "lastName": lastName,
            "type": type,
        })
        setOpenEditNameBox(true)
    }

    // Edit Detials
    const [editDetails, setEditDetails] = useState('')
    const [openEditBox, setOpenEditBox] = useState(false);
    const handleEditDetails = (label, fieldName, fieldValue, type) => {
        setEditDetails({
            "apiEndPoint": "student/update/student_details/",
            "label": label,
            "fieldName": fieldName,
            "fieldValue": fieldValue,
            "type": type,
        })
        setOpenEditBox(true)
    }

    // Change Password
    const [openChangePassword, setOpenChangePassword] = useState(false)
    const editPassword = () => {
        setOpenChangePassword(true)
    }

    // Edit Address Detials
    const [editAddessDetails, setEditAddessDetails] = useState('')
    const [openEditAddress, setOpenEditAddress] = useState(false);
    const handleEditAddressDetails = (address1, address2, city, state, country, pincode) => {
        const addressData = {
            address1: address1,
            address2: address2,
            city: city,
            state: state,
            country: country,
            pincode: pincode,
        };

        setEditAddessDetails({
            apiEndPoint: "student/update/student_details/",
            addressData: addressData,
        });
        setOpenEditAddress(true);
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function formatDate2(dateString) {
        const date = new Date(dateString);
        
        // Get the day, month, and year components
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        // Combine the components in the desired format
        return `${year}-${month}-${day}`;
    }
    const handleClose = () => {
        setOpen(false);
    };

    const [editLogoDetails, setEditLogoDetails] = useState('')
    const [openEditLogo, setOpenEditLogo] = useState(false);
    const editSchoolImage = (url) => {
        setEditLogoDetails({
            imgUrl: url,
            apiUrl: `student/update/student_details/`
        })
        setOpenEditLogo(true)
    }

    return (
        <Grid container sx={{ marginBottom: mob ? "20px" : "-30px", backgroundColor: '#F4F7FC', pt: 7, pl: mob ? 0 : 1, height: mob?null: window.innerHeight}}>
            <Grid item lg={12} md={12} sm={12} xs={12} component={'div'}>
                {mob ? (<Grid container mt={1} sx={{ pl: 0 }} gap={0}>
                    <Grid item lg={5} xs={3}>
                        <BackLink />
                    </Grid>
                    <Grid item lg={5} xs={7}>
                        <Typography sx={{ fontWeight: 'bold', mb: mob ? 0 : 6, fontSize: 16, margin: "0px", marginBottom: "0px", marginLeft: "35px", color: "#000000", fontFamily: "Montserrat" }}>Student Profile</Typography>
                    </Grid>
                </Grid>
                ) : (<BackLink />)}
                <Card sx={{ m: 2, p: mob ? 2 : 4, pl: mob ? 2 : 6, borderRadius: "16px", boxShadow: "0px 1px 6px 0px rgba(0,0,0,0.2)", }}>
                    {
                        loading ? <Loader /> :
                            <>
                                {mob ? (null) : (<Typography sx={{ fontWeight: 'bold', mb: mob ? 1 : 6, fontSize: 24, color: "#000", fontFamily: "Montserrat" }}>Student Profile</Typography>)}
                                <Grid container sx={{ pl: mob ? 1 : 4 }} gap={mob ? 1 : 15}>
                                    {!mob ? (null) : (<Grid item lg={5} xs={12}>
                                        <Typography sx={{ fontWeight: 'bold', mb: mob ? 2 : 5, fontSize: 15 }}>Basic Information</Typography>
                                        <Box sx={{ paddingLeft: mob ? "15px" : "25px", mb: mob ? "30px" : "60px" }}>
                                            <Box sx={{ display: 'flex', mb: 3, alignItems: "center" }}>
                                                <Typography sx={{ flex: 0.5, fontWeight: 'bold' }} >Profile Pic </Typography>
                                                <Typography sx={{ flex: 0.5, alignItems: "center" }}>
                                                    <ImageListItem style={{ height: "75px" }}>
                                                        {studentDetails.profile_image ? (<Image
                                                            src={"https://cyber-tutor-x-backend.vercel.app/" + studentDetails.profile_image || require("../../assets/Images/profile.png")}
                                                            style={{ width: 75, height: 75, marginLeft: 0, marginRight: 0, borderRadius: "50px" }}
                                                        />) : (<Image
                                                            src={require("../../assets/Images/profile.png")}
                                                            style={{ width: 75, height: 75, marginLeft: 0, marginRight: 0, borderRadius: "50px" }}
                                                        />)}
                                                        <ImageListItemBar
                                                            actionPosition='left'
                                                            sx={{ width: 75, borderRadius: "0px 0px 75px 75px" }}
                                                            className='MuiImageListItemBar-positionBelow'
                                                            actionIcon={
                                                                <IconButton
                                                                    sx={{ color: 'rgba(255, 255, 255, 0.54)', marginLeft: "20px" }}
                                                                    aria-label={`info about `}
                                                                >
                                                                    <CameraAltOutlinedIcon style={{ color: "#fff" }} onClick={() => { editSchoolImage(studentDetails.profile_image) }} />
                                                                    {/* <CameraAltOutlinedIcon style={{ color: "#fff" }} /> */}
                                                                </IconButton>
                                                            }
                                                        />
                                                    </ImageListItem>
                                                </Typography>
                                            </Box>
                                            <InfoBox Head={'Username'} Desc={studentDetails.student_details?.username} onPresIcon={() => handleEditDetails("Username", "username", studentDetails.student_details?.username, "text")} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                            <InfoBox Head={'Password'} Desc={'********'} onPresIcon={editPassword} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                            <InfoBox Head={'Reportify ID'} Desc={studentDetails.student_details?.id} />
                                            <InfoBox Head={'Date Of Registration'} Desc={formatDate(studentDetails.student_details?.created_at)} />
                                            <InfoBox Head={'Current School'} Desc={studentDetails.school_details?.name} />
                                        </Box>
                                        {/* <InfoBox Head={'Date Of Registration'} Desc={formatDate(studentDetails.student_details?.created_at)} /> */}
                                    </Grid>)}
                                    <Grid item lg={5} xs={12}>
                                        <Typography sx={{ fontWeight: '600', mb: 4, fontSize: 14, mt: 0, color: "#3D3D3D" }}>Personal Infomation</Typography>
                                        <Box sx={{ paddingLeft: mob ? "15px" : "25px", mb: mob ? "30px" : "60px" }}>
                                            <InfoBox Head={'Full Name'} Desc={`${studentDetails.student_details?.first_name || ''} ${studentDetails.student_details?.middle_name || ''} ${studentDetails.student_details?.last_name || ''}`} onPresIcon={() => handleNameEditDetails(studentDetails.student_details?.first_name || '', studentDetails.student_details?.middle_name || '', studentDetails.student_details?.last_name || '', "text")} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                            <InfoBox Head={'Fathers Name'} Desc={studentDetails.student_details?.father_name} onPresIcon={() => handleEditDetails("Father Name", "father_name", studentDetails.student_details?.father_name, "text")} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                            <InfoBox Head={'Mothers Name'} Desc={studentDetails.student_details?.mother_name} onPresIcon={() => handleEditDetails("Mother Name", "mother_name", studentDetails.student_details?.mother_name, "text")} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                            <InfoBox Head={'Date Of Birth'} Desc={formatDate(studentDetails.student_details?.dob)} onPresIcon={() => handleEditDetails("Student DOB", "dob", formatDate2(studentDetails.student_details?.dob), "date")} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                            <InfoBox Head={'Address'} Desc={studentDetails.student_details?.address_line1 + ' ' + studentDetails.student_details?.address_line2 + ' ' + studentDetails.student_details?.city + ' ' + studentDetails.student_details?.state + ' ' + studentDetails.student_details?.country + " " + studentDetails.student_details?.pincode}
                                                onPresIcon={() => handleEditAddressDetails({
                                                    "label": "Address 1",
                                                    "name": "address_line1",
                                                    "value": studentDetails.student_details?.address_line1,
                                                    "type": "text",
                                                }, {
                                                    "label": "Address 2",
                                                    "name": "address_line2",
                                                    "value": studentDetails.student_details?.address_line2,
                                                    "type": "text",
                                                }, {
                                                    "label": "City",
                                                    "name": "city",
                                                    "value": studentDetails.student_details?.city,
                                                    "type": "text",
                                                }, {
                                                    "label": "State",
                                                    "name": "state",
                                                    "value": studentDetails.student_details?.state,
                                                    "type": "text",
                                                }, {
                                                    "label": "Country",
                                                    "name": "country",
                                                    "value": studentDetails.student_details?.country,
                                                    "type": "text",
                                                }, {
                                                    "label": "Pin Code",
                                                    "name": "pincode",
                                                    "value": studentDetails.student_details?.pincode,
                                                    "type": "number",
                                                })} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                        </Box>
                                        <Typography sx={{ fontWeight: 'bold', mb: 5, fontSize: 15 }}>Contact Information</Typography>
                                        <Box sx={{ paddingLeft: mob ? "15px" : "25px", mb: mob ? "30px" : "60px" }}>
                                            <InfoBox Head={'Email Id'} Desc={studentDetails.student_details?.email} onPresIcon={() => handleEditDetails("Email", "email", studentDetails.student_details?.email, "email")} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                            <InfoBox Head={"Parent's Mobile"} Desc={studentDetails.student_details?.parents_no} onPresIcon={() => handleEditDetails("Parent's Mobile", "parents_no", studentDetails.student_details?.parents_no, "number")} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                            <InfoBox Head={"Student's Mobile"} Desc={studentDetails.student_details?.phone_no} onPresIcon={() => handleEditDetails("Student's Mobile", "phone_no", studentDetails.student_details?.phone_no, "number")} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                        </Box>
                                    </Grid>
                                    {mob ? (null) : (<Grid item lg={5} xs={12}>
                                        <Typography sx={{ fontWeight: 'bold', mb: 5, fontSize: 15 }}>Basic Information</Typography>
                                        <Box sx={{ paddingLeft: mob ? "15px" : "25px", mb: mob ? "30px" : "60px" }}>
                                            <Box sx={{ display: 'flex', mb: 3, alignItems: "center" }}>
                                                <Typography sx={{ flex: 0.5, fontWeight: 'bold' }} >Profile Pic </Typography>
                                                <Typography sx={{ flex: 0.5, alignItems: "center" }}>
                                                    <ImageListItem style={{ height: "75px" }}>
                                                        {studentDetails.profile_image ? (<Image
                                                            src={"https://cyber-tutor-x-backend.vercel.app/" + studentDetails.profile_image || require("../../assets/Images/profile.png")}
                                                            style={{ width: 75, height: 75, marginLeft: 0, marginRight: 0, borderRadius: "50px" }}
                                                        />) : (<Image
                                                            src={require("../../assets/Images/profile.png")}
                                                            style={{ width: 75, height: 75, marginLeft: 0, marginRight: 0, borderRadius: "50px" }}
                                                        />)}
                                                        <ImageListItemBar
                                                            actionPosition='left'
                                                            sx={{ width: 75, borderRadius: "0px 0px 75px 75px" }}
                                                            className='MuiImageListItemBar-positionBelow'
                                                            actionIcon={
                                                                <IconButton
                                                                    sx={{ color: 'rgba(255, 255, 255, 0.54)', marginLeft: "20px" }}
                                                                    aria-label={`info about `}
                                                                >
                                                                    <CameraAltOutlinedIcon style={{ color: "#fff" }} onClick={() => { editSchoolImage(studentDetails.profile_image) }} />
                                                                    {/* <CameraAltOutlinedIcon style={{ color: "#fff" }} /> */}
                                                                </IconButton>
                                                            }
                                                        />
                                                    </ImageListItem>
                                                </Typography>
                                            </Box>
                                            <InfoBox Head={'Username'} Desc={studentDetails.student_details?.username} onPresIcon={() => handleEditDetails("Username", "username", studentDetails.student_details?.username, "text")} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                            <InfoBox Head={'Password'} Desc={'********'} onPresIcon={editPassword} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                            <InfoBox Head={'Reportify ID'} Desc={studentDetails.student_details?.id} />
                                            <InfoBox Head={'Date Of Registration'} Desc={formatDate(studentDetails.student_details?.created_at)} />
                                            <InfoBox Head={'Current School'} Desc={studentDetails.school_details?.name} />
                                        </Box>
                                        {/* <InfoBox Head={'Date Of Registration'} Desc={formatDate(studentDetails.student_details?.created_at)} /> */}
                                    </Grid>)}
                                </Grid>
                            </>
                    }
                </Card>
                <ChangePasword open={openChangePassword} setOpen={setOpenChangePassword} />
                <EditBox open={openEditBox} setOpen={setOpenEditBox} data={editDetails} />
                <EditSchoolLogo open={openEditLogo} setOpen={setOpenEditLogo} data={editLogoDetails} />
                <EditAddress open={openEditAddress} setOpen={setOpenEditAddress} data={editAddessDetails} />
                <FullName open={openEditNameBox} setOpen={setOpenEditNameBox} data={editNameDetails} />
            </Grid>
        </Grid>

    )
}
