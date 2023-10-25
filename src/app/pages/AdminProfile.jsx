import { Box, Card, Grid, Divider, Typography, useMediaQuery } from '@mui/material'
import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react'
import { Edit } from '@mui/icons-material'
import InfoBox from '../components/InfoBox'
import { Image } from 'react-bootstrap'
import ChangePasword from '../components/ChangePasswordDialog'
import { getAxiosWithToken } from '../axios/AxiosObj'
import Loader from '../components/Loader'
import EditSchoolLogo from "./infrastructure/EditSchoolILogo";
import EditBox from '../components/dialogs/EditBox'
import EditAddress from '../components/dialogs/EditAddress'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import { useSelector } from "react-redux";

const AdminProfile = () => {

    const { school } = useSelector(state => state.infra)

    const [apiData, setApiData] = useState({})
    const [loading, setLoading] = useState(false)
    const mob = useMediaQuery('(max-width:986px)');
    const getSchoolDetails = async () => {
        setLoading(true)
        // const Axios = getAxiosWithToken();
        // Axios.get('school/get/details/')
        //     .then(res => {
        //         if (res.data?.Success) {
        //             setApiData(res.data?.Data)
        //         }
        //     }).catch()
        //     .finally(() => setLoading(false))
        setApiData(school)
        setLoading(false)
    }

    useEffect(() => {
        getSchoolDetails()
    }, [school])

    // Change Password
    const [openChangePassword, setOpenChangePassword] = useState(false)
    const editPassword = () => {
        setOpenChangePassword(true)
    }

    // Edit Image Logo
    const [editLogoDetails, setEditLogoDetails] = useState('')
    const [openEditLogo, setOpenEditLogo] = useState(false);
    const editSchoolImage = () => {
        setEditLogoDetails({
            imgUrl: apiData.logo
        })
        setOpenEditLogo(true)
    }

    // Edit Detials
    const [editDetails, setEditDetails] = useState('')
    const [openEditBox, setOpenEditBox] = useState(false);
    const handleEditDetails = (label, fieldName, fieldValue, type) => {
        setEditDetails({
            "apiEndPoint": "school/edit/school/details/",
            "label": label,
            "fieldName": fieldName,
            "fieldValue": fieldValue,
            "type": type,
        })
        setOpenEditBox(true)
    }


    // Edit Detials
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
            apiEndPoint: "school/edit/school/details/",
            addressData: addressData,
        });
        setOpenEditAddress(true);
    };


    return (
        loading ? <Loader /> :
            <Grid container alignContent={"flex-start"} >
                <Box margin={0} mx={2}>
                    <Link
                        className="secondary"
                        to={'/'}
                        style={{ margin: "10px", marginBottom: "0px", display: "flex", cursor: "pointer", alignItems: "center", color: "#3D3D3D", fontSize: "14px", textDecoration: "none" }}
                    >
                        <ArrowBackIosIcon style={{ marginRight: "4px", fontSize: "12px" }} /> Back
                    </Link>
                </Box>
                <Grid container sx={{ backgroundColor: '#F4F7FC', height: 'max-content' }}>
                    <Grid item lg={2} md={3} sm={12} xs={12} justifyContent={'center'} textAlign={'center'}>
                        <Card sx={{ m: 2, p: 2, pt: 10, height: '100%' }}>
                            {apiData.logo ? (<Image
                                src={"https://cyber-tutor-x-backend.vercel.app/" + apiData.logo || require("../assets/Logo/noimage.png")}
                                style={{ width: 90, marginLeft: 15, marginRight: 15 }}
                            />) : (<Image
                                src={require("../assets/Logo/noimage.png")}
                                style={{ width: 90, marginLeft: 15, marginRight: 15 }}
                            />)}
                            <br />
                            <br />
                            {/* <Button color="info" size="large" onClick={() => { editSchoolImage() }} >Edit Logo</Button> */}
                            <Typography variant='h6' style={{ marginTop: 15, color: "#797979" }}>{apiData?.name}</Typography>
                            <Divider />
                        </Card>
                    </Grid>
                    <Grid item lg={9} md={9} sm={12} xs={12} component={'div'} height={'max-content'}>
                        <Card sx={{ m: 2, p: 2, }}>
                            <Typography sx={{ fontWeight: 'bold', mb: 3, fontSize: 20, color: "#797979" }}>Institution Details</Typography>
                            <Grid container gap={15}>
                                <Grid item lg={5} xs={12} sx={{ pl: "12px" }}>
                                    <Typography sx={{ fontWeight: 'bold', mb: 4, fontSize: 14, color: "#3D3D3D" }}>Basic Information</Typography>
                                    <Box sx={{ paddingLeft: "25px", mb: "60px" }}>
                                        <Box sx={{ display: 'flex', mb: 3, alignItems:"center" }}>
                                            <Typography sx={{ flex: 0.5, fontWeight: 'bold' }} >Logo </Typography>
                                            <Typography sx={{ flex: 0.5, alignItems: "center" }}>
                                                <ImageListItem style={{ height: "75px" }}>
                                                    {apiData.logo ? (<Image
                                                        src={"https://cyber-tutor-x-backend.vercel.app/" + apiData.logo || require("../assets/Logo/noimage.png")}
                                                        style={{ width: 75, height: 75, marginLeft: 0, marginRight: 0, borderRadius: "50px" }}
                                                    />) : (<Image
                                                        src={require("../assets/Logo/noimage.png")}
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
                                                                <CameraAltOutlinedIcon style={{ color: "#fff" }} onClick={() => { editSchoolImage() }} />
                                                            </IconButton>
                                                        }
                                                    />
                                                </ImageListItem>
                                            </Typography>
                                        </Box>
                                        <InfoBox Head={'School Name'} Desc={apiData?.name} onPresIcon={() => handleEditDetails("School Name", "name", apiData?.name, "text")} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                        {/* Address */}
                                        <InfoBox
                                            Head={'Address'}
                                            Desc={apiData?.address_line1 + ' ' + apiData?.address_line2 + ' ' + apiData?.city + ' ' + apiData?.state + ' ' + apiData?.country+ ' ' + (apiData?.pincode || '')}
                                            onPresIcon={() => handleEditAddressDetails({
                                                "label": "Address 1",
                                                "name": "address_line1",
                                                "value": apiData?.address_line1,
                                                "type": "text",
                                            }, {
                                                "label": "Address 2",
                                                "name": "address_line2",
                                                "value": apiData?.address_line2,
                                                "type": "text",
                                            }, {
                                                "label": "City",
                                                "name": "city",
                                                "value": apiData?.city,
                                                "type": "text",
                                            }, {
                                                "label": "State",
                                                "name": "state",
                                                "value": apiData?.state,
                                                "type": "text",
                                            }, {
                                                "label": "Country",
                                                "name": "country",
                                                "value": apiData?.country,
                                                "type": "text",
                                            }, {
                                                "label": "Pin code",
                                                "name": "pin",
                                                "value": apiData?.pincode,
                                                "type": "number",
                                            })}
                                            IconTag={<Edit sx={{ width: "15px", height: "15px" }} />}
                                        />
                                        <InfoBox Head={'Board'} Desc={apiData?.board} onPresIcon={() => handleEditDetails("School board", "board", apiData?.board, "text")} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                        <InfoBox Head={'Registration Number'} Desc={apiData?.registration_no} onPresIcon={() => handleEditDetails("Registration Number", "registration_no", apiData?.registration_no, "text")} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                    </Box>
                                    <Typography sx={{ fontWeight: 'bold', mb: 4, fontSize: 14, color: "#3D3D3D" }}>Contact Information</Typography>
                                    <Box sx={{ paddingLeft: "30px", mb: "120px" }}>
                                        <InfoBox Head={'Principle Name'} Desc={apiData?.principle_name} onPresIcon={() => handleEditDetails("Principle Name", "principle_name", apiData?.principle_name, "text")} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                        <InfoBox Head={'Principle Contact Number'} Desc={apiData?.owner_phone} onPresIcon={() => handleEditDetails("Principle Contact Number", "owner_phone", apiData?.owner_phone, "number")} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                    </Box>
                                </Grid>
                                <Grid item lg={5} xs={12}>
                                    <Typography sx={{ fontWeight: 'bold', mb: 4, fontSize: 14, mt: 0, color: "#3D3D3D" }}>Profile Information</Typography>
                                    <Box sx={{ paddingLeft: "25px", mb: "60px" }}>
                                        <InfoBox Head={'Username'} Desc={localStorage.getItem("username")} onPresIcon={() => handleEditDetails("Username", "user", localStorage.getItem("username"), "text")} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                        <InfoBox Head={"Password"} Desc={'*********'} onPresIcon={editPassword} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                        <InfoBox Head={'Registered Email ID'} Desc={apiData?.email} onPresIcon={() => handleEditDetails("Registered Email ID", "email", apiData?.email, "email")} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                        <InfoBox Head={'Registered Mobile Number'} Desc={apiData?.phone} onPresIcon={() => handleEditDetails("Registered Mobile Number", "phone", apiData?.phone, "number")} IconTag={<Edit sx={{ width: "15px", height: "15px" }} />} />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                    <ChangePasword open={openChangePassword} setOpen={setOpenChangePassword} />
                    <EditSchoolLogo open={openEditLogo} setOpen={setOpenEditLogo} data={editLogoDetails} />
                    <EditBox open={openEditBox} setOpen={setOpenEditBox} data={editDetails} />
                    <EditAddress open={openEditAddress} setOpen={setOpenEditAddress} data={editAddessDetails} />
                </Grid>
            </Grid>
    )
}
export default AdminProfile
