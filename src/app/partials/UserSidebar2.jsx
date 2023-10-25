import { Box, Divider, Stack, Typography, useMediaQuery } from '@mui/material'
import React from 'react'
import { Image } from 'react-bootstrap'
import { useSelector } from "react-redux";

export const UserSidebar = ({ profilePhoto, name, session, sClass, sSection }) => {
    const { studentDetails } = useSelector(state => state.infra)
    const mob = useMediaQuery('(max-width:986px)')
    return (
        <Box sx={{ backgroundColor: 'white', padding: 2, height: '100%', width: '100%', }}>
            <Stack spacing={2} direction={mob ? 'row' : 'column'} alignItems={'center'}>
                <Box textAlign={'center'}>
                    {profilePhoto == "" || profilePhoto == undefined || profilePhoto == null ? (<Image src={require('../assets/Images/profile.png')} width={'150'}height={'150'} style={{ borderRadius: "150px" }} />) : (<Image src={"https://cyber-tutor-x-backend.vercel.app/" + profilePhoto} width={'150'}height={'150'} style={{ borderRadius: "150px" }} />)}
                    <Typography variant='h5'>{name}</Typography>
                    {/* <Typography variant='body1'>Excellent in mathematics</Typography> */}
                </Box>
                <Box  >
                    <Divider />
                    <table>
                        <tbody>
                            <tr>
                                <td><Typography variant='h6'>Class : </Typography></td>
                                <td> &nbsp; &nbsp;</td>
                                <td><Typography variant='h6' style={{ textTransform: "capitalize" }}> {sClass}</Typography></td>
                            </tr>
                            <tr>
                                <td><Typography variant='h6'>Section : </Typography></td>
                                <td> &nbsp; &nbsp;</td>
                                <td><Typography variant='h6'>{(sSection || "A").toUpperCase()}</Typography></td>
                            </tr>
                            <tr>
                                <td><Typography variant='h6'>Session : </Typography></td>
                                <td> &nbsp; &nbsp;</td>
                                <td><Typography variant='h6'> {session}</Typography></td>
                            </tr>
                        </tbody>
                    </table>
                    <Divider />

                </Box>
            </Stack>
        </Box>
    )
}
