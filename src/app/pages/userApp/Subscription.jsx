import { Box, Card, Button, Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material'
import React, { useState } from 'react'
import { Edit } from '@mui/icons-material'
import { useEffect } from 'react'
import AxiosObj from '../../axios/AxiosObj'
import Loader from '../../components/Loader'
import Switch from '@mui/material/Switch';
import { useSelector } from "react-redux"
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Link } from "react-router-dom";
import BackLink from './backBtn';

export const Subscription = () => {

    const { studentDetails } = useSelector(state => state.infra)
    const [Open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [changedPrice, setChangedPrice] = useState(false)
    const mob = useMediaQuery('(max-width:800px)')

    const handlePriceChange = (e) => {
        // console.log(e)
        if (e.target.checked == true) {
            setChangedPrice(true)
        } else {
            setChangedPrice(false)
        }
    }

    return (
        <Grid container sx={{ backgroundColor: '#F4F7FC', pt: 8, marginBottom: "60px" }}>
            <BackLink />
            {mob ? (null) : (<Grid container mx={10}>
                <Stack>
                    <Typography sx={{ fontWeight: '600', mb: 0, fontSize: 16, color: "#000" }}>Upgrade to unleash everything</Typography>
                    <Typography sx={{ fontWeight: '500', mb: 1, fontSize: 13, color: "#797979" }}>Your progress report is currently on the Free Plan</Typography>
                </Stack>
            </Grid>)}
            <Grid container justifyContent={"center"}>
                {mob ? (<Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ fontWeight: '600', mb: 0, fontSize: 16, color: "#000" }}>Monthly</Typography>
                    <Switch checked={changedPrice} onChange={handlePriceChange} />
                    <Stack direction="column" spacing={1} alignItems="center" justifyContent={"center"} >
                        <Typography sx={{ fontWeight: '600', mb: 0, fontSize: 16, color: "#000" }}>Yearly</Typography>
                        <span style={{ fontSize: "12px", textAlign: "start", fontWeight: "500", alignSelf: "flex-end", lineHeight: "0.2", marginBottom: "6px", color: "#3BDC0B" }}>15% off </span>
                    </Stack>
                </Stack>) : (<Card sx={{ m: 2, px: 8, py: 1, borderRadius: 50 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography sx={{ fontWeight: '600', mb: 0, fontSize: 16, color: "#000" }}>Monthly</Typography>
                        <Switch checked={changedPrice} onChange={handlePriceChange} />
                        <Stack direction="column" spacing={1} alignItems="center" justifyContent={"center"} >
                            <Typography sx={{ fontWeight: '600', mb: 0, fontSize: 16, color: "#000" }}>Yearly</Typography>
                            <span style={{ fontSize: "12px", textAlign: "start", fontWeight: "500", alignSelf: "flex-end", lineHeight: "0.2", marginBottom: "6px", color: "#3BDC0B" }}>15% off </span>
                        </Stack>
                    </Stack>
                </Card>)}

            </Grid>
            <Grid container justifyContent={"center"}>
                <Grid item lg={3} md={3} sm={12} xs={12} component={'div'}>
                    <Card sx={{ m: 2, p: 0, borderRadius: 4, display: mob ? "flex" : "block", flexDirection: mob ? "row" : "", }}>
                        <Card sx={{ p: mob ? 2 : 3, py: 2, textAlign: "center", borderRadius: 0, display: mob ? "flex" : "", justifyContent: mob ? "space-between" : "", flexDirection: mob ? "column" : "", }}>
                            <div>
                                <Typography sx={{ fontWeight: 'bold', mb: 0, fontSize: 22, color: "#65D7FF" }}>Basic</Typography>
                                <Typography sx={{ fontWeight: 'bold', mb: 1, fontSize: 38, color: "#3D3D3D" }}>FREE</Typography>
                            </div>
                            {
                                !mob ? (null) : (<Stack direction="row" spacing={1} mt={5} mb={1} alignItems="center" justifyContent={"center"}>
                                    <Button color="info" style={{ borderRadius: "20px", fontSize: "10px", fontWeight: "600", background: "#53DCA2", color: "#3D3D3D", padding: "8px 15px", width: "130px" }}>Current Plan</Button>
                                </Stack>)
                            }
                        </Card>
                        <Divider sx={{ borderWidth: "1.2px", marginBottom: "10px", borderColor: '#53DCA2' }} />
                        <Card sx={{ p: mob ? 2 : 2, pb: 0, pl: mob ? 2 : 5 }}>
                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CheckCircleOutlineIcon style={{ color: "#0DCE7C" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#000" }}>Test result</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CheckCircleOutlineIcon style={{ color: "#0DCE7C" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#000" }}>Marks comparison</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CheckCircleOutlineIcon style={{ color: "#0DCE7C" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#000" }}>Attendance, teacher's & co-scholastic</Typography>
                            </Stack>

                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CancelOutlinedIcon style={{ color: "#FF3E3E" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#797979" }}>Access to all test results</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CancelOutlinedIcon style={{ color: "#FF3E3E" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#797979" }}>Analytic & growth mapping</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CheckCircleOutlineIcon style={{ color: "#0DCE7C" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#000" }}>Co-curricular achievements</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CheckCircleOutlineIcon style={{ color: "#0DCE7C" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#000" }}>Co-curricular grading</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CancelOutlinedIcon style={{ color: "#FF3E3E" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#797979" }}>Co-curricular events details</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CancelOutlinedIcon style={{ color: "#FF3E3E" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#797979" }}>Events vs participation details</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CancelOutlinedIcon style={{ color: "#FF3E3E" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#797979" }}>Co-curricular outcome mapping</Typography>
                            </Stack>
                            {
                                mob ? (null) : (<Stack direction="row" spacing={1} mt={5} mb={3} alignItems="center" justifyContent={"center"}>
                                    <Button color="info" style={{ borderRadius: "20px", fontSize: "14px", fontWeight: "600", background: "#53DCA2", color: "#3D3D3D", padding: "9px 50px" }}>Current Plan</Button>
                                </Stack>)
                            }
                        </Card>
                    </Card>
                </Grid>
                <Grid item lg={3} md={3} sm={12} xs={12} component={'div'}>
                    <Card sx={{ m: 2, p: 0, borderRadius: 4, display: mob ? "flex" : "block", flexDirection: mob ? "row" : "", }}>
                        <Card sx={{ p: mob ? 2 : 3, py: 2, textAlign: "center", borderRadius: 0, display: mob ? "flex" : "", justifyContent: mob ? "space-between" : "", flexDirection: mob ? "column" : "", }}>
                            <div>
                                <Typography sx={{ fontWeight: 'bold', mb: 0, fontSize: 22, color: "#65D7FF" }}>Standard</Typography>
                                <Typography sx={{ fontWeight: 'bold', mb: 1, fontSize: 38, color: "#3D3D3D", display: "flex", justifyContent: "center", gap: mob ? "0px" : "8px", flexWrap: mob ? "wrap" : "" }}> <span style={{ fontSize: "20px", marginTop: "6px" }}>INR</span> {!changedPrice ? ("49") : ("499")}<span style={{ fontSize: "14px", textAlign: "start", fontWeight: "500", alignSelf: "flex-end", lineHeight: "1.3", marginBottom: "6px" }}>per  {mob ? (<br />) : (<br />)} Month</span></Typography>
                            </div>

                            {
                                !mob ? (null) : (<Stack direction="row" spacing={1} mt={5} mb={1} alignItems="center" justifyContent={"center"}>
                                    <Button color="info" style={{ borderRadius: "20px", fontSize: "10px", fontWeight: "600", background: "#69D8FF", color: "#3D3D3D", padding: "8px 15px", width: "130px" }}>Get Started</Button>
                                </Stack>)
                            }
                        </Card>
                        <Divider sx={{ borderWidth: "1.2px", marginBottom: "10px", borderColor: '#53DCA2' }} />
                        <Card sx={{ p: mob ? 2 : 2, pb: 0, pl: mob ? 2 : 5 }}>
                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CheckCircleOutlineIcon style={{ color: "#0DCE7C" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#000" }}>Test result</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CheckCircleOutlineIcon style={{ color: "#0DCE7C" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#000" }}>Marks comparison</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CheckCircleOutlineIcon style={{ color: "#0DCE7C" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#000" }}>Attendance, teacher's & co-scholastic</Typography>
                            </Stack>

                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CheckCircleOutlineIcon style={{ color: "#0DCE7C" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#000" }}>Access to all test results</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CheckCircleOutlineIcon style={{ color: "#0DCE7C" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#000" }}>Analytic & growth mapping</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CheckCircleOutlineIcon style={{ color: "#0DCE7C" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#000" }}>Co-curricular achievements</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CheckCircleOutlineIcon style={{ color: "#0DCE7C" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#000" }}>Co-curricular grading</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CancelOutlinedIcon style={{ color: "#FF3E3E" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#797979" }}>Co-curricular events details</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CancelOutlinedIcon style={{ color: "#FF3E3E" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#797979" }}>Events vs participation details</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CancelOutlinedIcon style={{ color: "#FF3E3E" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#797979" }}>Co-curricular outcome mapping</Typography>
                            </Stack>
                            {
                                mob ? (null) : (<Stack direction="row" spacing={1} mt={5} mb={3} alignItems="center" justifyContent={"center"}>
                                    <Button color="info" style={{ borderRadius: "20px", fontSize: "14px", fontWeight: "600", background: "#69D8FF", color: "#3D3D3D", padding: "9px 50px" }}>Get Started</Button>
                                </Stack>)
                            }
                        </Card>
                    </Card>
                </Grid>
                <Grid item lg={3} md={3} sm={12} xs={12} component={'div'}>
                    <Card sx={{ m: 2, p: 0, borderRadius: 4, display: mob ? "flex" : "block", flexDirection: mob ? "row" : "", }}>
                        <Card sx={{ p: mob ? 2 : 3, py: 2, textAlign: "center", borderRadius: 0, display: mob ? "flex" : "", justifyContent: mob ? "space-between" : "", flexDirection: mob ? "column" : "", }}>
                            <div>
                                <Typography sx={{ fontWeight: 'bold', mb: 0, fontSize: 22, color: "#65D7FF" }}>Premium</Typography>
                                <Typography sx={{ fontWeight: 'bold', mb: 1, fontSize: 38, color: "#3D3D3D", display: "flex", justifyContent: "center", gap: mob ? "0px" : "8px", flexWrap: mob ? "wrap" : "" }}> <span style={{ fontSize: "20px", marginTop: "6px" }}>INR</span> {!changedPrice ? ("99") : ("999")}<span style={{ fontSize: "14px", textAlign: "start", fontWeight: "500", alignSelf: "flex-end", lineHeight: "1.3", marginBottom: "6px" }}>per  {mob ? (<br />) : (<br />)} Month</span></Typography>
                            </div>

                            {
                                !mob ? (null) : (<Stack direction="row" spacing={1} mt={5} mb={1} alignItems="center" justifyContent={"center"}>
                                    <Button color="info" style={{ borderRadius: "20px", fontSize: "10px", fontWeight: "600", background: "#69D8FF", color: "#3D3D3D", padding: "8px 15px", width: "130px" }}>Get Started</Button>
                                </Stack>)
                            }
                        </Card>
                        <Divider sx={{ borderWidth: "1.2px", marginBottom: "10px", borderColor: '#53DCA2' }} />
                        <Card sx={{ p: mob ? 2 : 2, pb: 0, pl: mob ? 2 : 5 }}>
                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CheckCircleOutlineIcon style={{ color: "#0DCE7C" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#000" }}>Test result</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CheckCircleOutlineIcon style={{ color: "#0DCE7C" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#000" }}>Marks comparison</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CheckCircleOutlineIcon style={{ color: "#0DCE7C" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#000" }}>Attendance, teacher's & co-scholastic</Typography>
                            </Stack>

                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CheckCircleOutlineIcon style={{ color: "#0DCE7C" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#000" }}>Access to all test results</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CheckCircleOutlineIcon style={{ color: "#0DCE7C" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#000" }}>Analytic & growth mapping</Typography>
                            </Stack>

                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CheckCircleOutlineIcon style={{ color: "#0DCE7C" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#000" }}>Co-curricular achievements</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CheckCircleOutlineIcon style={{ color: "#0DCE7C" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#000" }}>Co-curricular grading</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CheckCircleOutlineIcon style={{ color: "#0DCE7C" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#000" }}>Co-curricular events details</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CheckCircleOutlineIcon style={{ color: "#0DCE7C" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#000" }}>Events vs participation details</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} mb={mob ? 1 : 2} alignItems="center">
                                <CheckCircleOutlineIcon style={{ color: "#0DCE7C" }} />
                                <Typography sx={{ fontWeight: '500', mb: mob ? 0 : 1, fontSize: mob ? 12 : 14, color: "#000" }}>Co-curricular outcome mapping</Typography>
                            </Stack>
                            {
                                mob ? (null) : (<Stack direction="row" spacing={1} mt={5} mb={3} alignItems="center" justifyContent={"center"}>
                                    <Button color="info" style={{ borderRadius: "20px", fontSize: "14px", fontWeight: "600", background: "#69D8FF", color: "#3D3D3D", padding: "9px 50px" }}>Get Started</Button>
                                </Stack>)
                            }
                        </Card>
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    )
}
