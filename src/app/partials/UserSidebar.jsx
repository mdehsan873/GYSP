import { Box, Divider, Stack, Typography, useMediaQuery } from '@mui/material'
import React from 'react'
import { Image } from 'react-bootstrap'
import { useSelector } from "react-redux";

export const UserSidebar = () => {
    const { studentDetails } = useSelector(state => state.infra)
    const mob = useMediaQuery('(max-width:800px)')
    return (
        <Box sx={{ backgroundColor: 'white', padding: 2, height: '100%', width: '15%', left: "0" }} position="fixed">
            <Stack spacing={2} direction={mob ? 'row' : 'column'} alignItems={'center'}>
                <Box textAlign={'center'}>
                    {studentDetails.profile_image == "" || studentDetails.profile_image == undefined || studentDetails.profile_image == null ? (<Image src={require('../assets/Images/profile.png')} width={'150'} height={'150'} style={{ borderRadius: "150px" }} />) : (<Image src={"https://cyber-tutor-x-backend.vercel.app/" + studentDetails.profile_image} width={'150'} height={'150'} style={{ borderRadius: "150px" }} />)}
                    <Typography variant='h5'>{`${studentDetails.student_details?.first_name || ''} ${studentDetails.student_details?.middle_name || ''} ${studentDetails.student_details?.last_name || ''}`}</Typography>
                    {/* <Typography variant='body1'>Excellent in mathematics</Typography> */}
                </Box>
                <Box  >
                    <Divider sx={{ borderWidth: "1.8px", marginBottom: "10px" }} />
                    <table>
                        <tbody>
                            <tr>
                                <td><Typography variant='h6' style={{ fontSize: "18px" }}>Class : </Typography></td>
                                <td> &nbsp; &nbsp;</td>
                                <td><Typography variant='h6' style={{ textTransform: "capitalize" }}> {studentDetails.class_name}</Typography></td>
                            </tr>
                            <tr>
                                <td><Typography variant='h6' style={{ fontSize: "18px" }}>Section : </Typography></td>
                                <td> &nbsp; &nbsp;</td>
                                <td><Typography variant='h6'>{(studentDetails.section || "A").toUpperCase()}</Typography></td>
                            </tr>
                            <tr>
                                <td><Typography variant='h6' style={{ fontSize: "18px" }}>Session : </Typography></td>
                                <td> &nbsp; &nbsp;</td>
                                <td><Typography variant='h6'> {studentDetails.session}</Typography></td>
                            </tr>
                        </tbody>
                    </table>
                    <Divider sx={{ borderWidth: "1.8px", marginTop: "10px" }} />
                </Box>
            </Stack>
        </Box>
    )
}
