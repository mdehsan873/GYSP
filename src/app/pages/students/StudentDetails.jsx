// import { Box, Card, Container, Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material'
import { Card, Grid, Typography, Box } from '@mui/material'
import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { UserSidebar } from '../../partials/UserSidebar2'
import InfoBox from '../../components/InfoBox'
import { Image } from 'react-bootstrap'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import AxiosObj from '../../axios/AxiosObj'
import secureLocalStorage from "react-secure-storage";
import Loader from '../../components/Loader'
import EditBox from '../../components/dialogs/EditBox'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import { Edit } from '@mui/icons-material'
import EditAddress from '../../components/dialogs/EditAddress'
import FullName from '../../components/dialogs/FullName'
import EditSchoolLogo from "../userApp/EditSchoolILogo";
import { resetLocal } from './../../partials/localStorage'

export default function StudentDetails({ open, setOpen, data, setViewDetails }) {

    useEffect(() => {
        resetLocal("student");
    }, []);

    const [userDetails, setUserDetails] = useState({})
    const [loading, setLoading] = useState(false)
    // const mob = useMediaQuery('(max-width:600px)')
    const para = useParams();

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
    

    const [editDetails, setEditDetails] = useState('')

    const [openEditBox, setOpenEditBox] = useState(false);
    const editStudentDetails = (label, fieldName, fieldValue, type) => {
        setEditDetails({
            "apiEndPoint": "student/edit/" + id + "/",
            "label": label,
            "fieldName": fieldName,
            "fieldValue": fieldValue,
            "type": type,
        })
        setOpenEditBox(true)
    }


    const fetchUserDetails = async (id, change_session_id) => {
        setLoading(true)
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'student/get/student/details/' + id + '?change_session_id=' + change_session_id,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
            },
        };

        AxiosObj.request(config)
            .then((response) => {
                // console.log(JSON.stringify(response.data.Data))
                setUserDetails(response.data.Data)
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => { setLoading(false) })
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
            apiEndPoint: "student/edit/" + id + "/",
            addressData: addressData,
        });
        setOpenEditAddress(true);
    };

    const [editLogoDetails, setEditLogoDetails] = useState('')
    const [openEditLogo, setOpenEditLogo] = useState(false);
    const editSchoolImage = (url) => {
        setEditLogoDetails({
            imgUrl: url,
            apiUrl: "student/edit/" + id + "/"
        })
        setOpenEditLogo(true)
    }

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    };

    const handleClose = () => {
        setOpen(false);
        setViewDetails('')
    };

    const { id, change_session_id } = para;
    useEffect(() => {
        if (para && id && change_session_id) {
            fetchUserDetails(id, change_session_id)
        }
    }, [para])

    return (
        <Grid container sx={{ backgroundColor: '#F4F7FC' }}>
            <Grid item lg={2} md={2} sm={12} xs={12}>
                {loading ? <Loader /> : <UserSidebar profilePhoto={userDetails.profile_image} name={userDetails.student_details?.first_name + ' ' + (userDetails.student_details?.middle_name == null ? ("") : (userDetails.student_details?.middle_name)) + ' ' + (userDetails.student_details?.last_name == null ? ("") : (userDetails.student_details?.last_name))} session={userDetails?.session} sClass={userDetails?.class_name} sSection={userDetails?.section} />}
            </Grid>
            <Grid item lg={9} md={9} sm={12} xs={12} component={'div'}>
                <Link
                    className="secondary"
                    to={'/students'}
                    style={{ margin: "10px", marginBottom: "0px", display: "flex", cursor: "pointer", alignItems: "center", color: "#3D3D3D", fontSize: "12px" }}
                >
                    <ArrowBackIosIcon style={{ marginRight: "4px", fontSize: "12px" }} /> Back
                </Link>
                <Card sx={{ m: 2, p: 4, pl: 6, borderRadius: "16px",boxShadow: "0px 3px 6px 0px rgba(0,0,0,0.2)",  }}>
                    {
                        loading ? <Loader /> :
                            <>
                                <Typography sx={{ fontWeight: 'bold', mb: 6, fontSize: 24, color: "#797979", fontFamily: "Montserrat" }}>Student Profile</Typography>
                                <Grid container sx={{ pl: 4 }} gap={15}>
                                    <Grid item lg={5} xs={12}>
                                        <Typography sx={{ fontWeight: '600', mb: 4, fontSize: 14, mt: 0, color: "#3D3D3D" }}>Personal Infomation</Typography>
                                        <Box sx={{ paddingLeft: "25px", mb: "60px" }}>
                                            <InfoBox Head={'Name'} Desc={`${userDetails.student_details?.first_name || ''} ${userDetails.student_details?.middle_name || ''} ${userDetails.student_details?.last_name || ''}`} onPresIcon={() => handleNameEditDetails(userDetails.student_details?.first_name || '', userDetails.student_details?.middle_name || '', userDetails.student_details?.last_name || '', "text")} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />}/>
                                            {/* <InfoBox Head={'Fathers Name'} Desc={userDetails.student_details?.father_name} onPresIcon={() => editStudentDetails("Father's Name", "father_name", userDetails.student_details?.father_name, "text")} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} /> */}
                                            <InfoBox Head={'Fathers Name'} Desc={userDetails.student_details?.father_name} onPresIcon={() => editStudentDetails("Father's Name", "father_name", userDetails.student_details?.father_name, "text")} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                            <InfoBox Head={'Mothers Name'} Desc={userDetails.student_details?.mother_name} onPresIcon={() => editStudentDetails("Mother's Name", "mother_name", userDetails.student_details?.mother_name, "text")} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                            <InfoBox Head={'Date Of Birth'} Desc={formatDate(userDetails.student_details?.dob)} onPresIcon={() => editStudentDetails("Date Of Birth", "dob", userDetails.student_details?.dob, "Date")} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                            <InfoBox Head={'Address'} Desc={userDetails.student_details?.address_line1 + ' ' + userDetails.student_details?.address_line2 + ' ' + userDetails.student_details?.city + ' ' + userDetails.student_details?.state + ' ' + userDetails.student_details?.country + " "+ userDetails.student_details?.pincode}
                                                onPresIcon={() => handleEditAddressDetails({
                                                    "label": "Address 1",
                                                    "name": "address_line1",
                                                    "value": userDetails.student_details?.address_line1,
                                                    "type": "text",
                                                }, {
                                                    "label": "Address 2",
                                                    "name": "address_line2",
                                                    "value": userDetails.student_details?.address_line2,
                                                    "type": "text",
                                                }, {
                                                    "label": "City",
                                                    "name": "city",
                                                    "value": userDetails.student_details?.city,
                                                    "type": "text",
                                                }, {
                                                    "label": "State",
                                                    "name": "state",
                                                    "value": userDetails.student_details?.state,
                                                    "type": "text",
                                                }, {
                                                    "label": "Country",
                                                    "name": "country",
                                                    "value": userDetails.student_details?.country,
                                                    "type": "text",
                                                }, {
                                                    "label": "Pin Code",
                                                    "name": "pincode",
                                                    "value": userDetails.student_details?.pincode,
                                                    "type": "number",
                                                })} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                        </Box>
                                        <Typography sx={{ fontWeight: 'bold', mb: 5, fontSize: 15 }}>Contact Information</Typography>
                                        <Box sx={{ paddingLeft: "30px", mb: "60px" }}>
                                            <InfoBox Head={'Email Id'} Desc={userDetails.student_details?.email} onPresIcon={() => editStudentDetails("Email", "email", userDetails.student_details?.email, "email")} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                            <InfoBox Head={"Parent's Mobile"} Desc={userDetails.student_details?.parents_no} onPresIcon={() => editStudentDetails("Parent's Number", "parents_no", userDetails.student_details?.parents_no, "number")} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                            <InfoBox Head={"Student's Mobile"} Desc={userDetails.student_details?.phone_no} onPresIcon={() => editStudentDetails("Phone Number", "phone_no", userDetails.student_details?.phone_no, "number")} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                        </Box>
                                    </Grid>
                                    <Grid item lg={5} xs={12}>
                                        <Typography sx={{ fontWeight: 'bold', mb: 5, fontSize: 15 }}>Basic Information</Typography>
                                        <Box sx={{ paddingLeft: "25px", mb: "60px" }}>
                                            <Box sx={{ display: 'flex', mb: 3, alignItems: "center" }}>
                                                <Typography sx={{ flex: 0.5, fontWeight: 'bold' }} >Profile Pic </Typography>
                                                <Typography sx={{ flex: 0.5, alignItems: "center" }}>
                                                    <ImageListItem style={{ height: "75px" }}>
                                                        {userDetails.profile_image ? (<Image
                                                            src={"https://cyber-tutor-x-backend.vercel.app/" + userDetails.profile_image || require("../../assets/Images/profile.png")}
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
                                                                    <CameraAltOutlinedIcon style={{ color: "#fff" }} onClick={() => { editSchoolImage(userDetails.profile_image) }} />
                                                                    {/* <CameraAltOutlinedIcon style={{ color: "#fff" }} /> */}
                                                                </IconButton>
                                                            }
                                                        />
                                                    </ImageListItem>
                                                </Typography>
                                            </Box>
                                            <InfoBox Head={'Username'} Desc={userDetails.student_details?.username} />
                                            <InfoBox Head={'Registration No.'} Desc={userDetails.registration_no} />
                                        </Box>
                                        {/* <InfoBox Head={'Date Of Registration'} Desc={formatDate(userDetails.student_details?.created_at)} /> */}
                                    </Grid>
                                </Grid>
                            </>
                    }
                </Card>
            </Grid>
            <EditBox open={openEditBox} setOpen={setOpenEditBox} data={editDetails} />
            <EditSchoolLogo open={openEditLogo} setOpen={setOpenEditLogo} data={editLogoDetails} />
            <EditAddress open={openEditAddress} setOpen={setOpenEditAddress} data={editAddessDetails} />
            <FullName open={openEditNameBox} setOpen={setOpenEditNameBox} data={editNameDetails} />
        </Grid>

    )
}
