import React from 'react'
import { Container, Divider, Grid, Paper, Stack, Typography, useMediaQuery } from '@mui/material'
import { Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import secureLocalStorage from "react-secure-storage";
import { useState, useEffect } from 'react'

export default function UserHome() {

    const mob = useMediaQuery("(max-width:800px)");

    const handleClick = () => {
        secureLocalStorage.setItem("setNavBarTab", 1)
    }
    useEffect(() => {
        if (secureLocalStorage.getItem("setNavBarTab")) {
            secureLocalStorage.removeItem("setNavBarTab")
        }
        if (secureLocalStorage.getItem("studentTabSession")) {
            secureLocalStorage.removeItem("studentTabSession")
        }
    }, [])

    return (
        <Container maxWidth={"xxl"} style={{ height: window.innerHeight, marginTop: mob ? "0px" : "0" }}>
            <Grid container my={0} gap={mob ? "20px" : "41px"} justifyContent={'center'} style={{ marginTop: mob ? "0" : null, height: mob ? window.innerHeight : window.innerHeight }} alignContent={"center"}  >
                <Grid item lg={4} md={4} sm={12}>
                    <Link to={'/student-overview/0'}>
                        <Paper component={Stack} spacing={2} alignItems={'center'} p={mob ? 1 : 5} py={mob ? 3 : 7} pt={mob ? 4 : 9} m={2} sx={{ width: mob ? "270px" : null, borderRadius: mob?"11px":"16px", boxShadow: "0px 3px 6px 0px rgba(0,0,0,0.2)", borderRadius: "14px" }}>
                            <Image src={require('../../assets/Images/userImg/Co-curricular Activities@2x.png')} height={mob ? "90px" : '200px'} />
                            <Divider style={{ border: "0.5px solid #707070", width: "85%", marginTop: mob ? "32px" : "45px" }} />
                            <Typography style={{ marginTop: mob ? "18px" : "28px" }} fontSize={mob ? "12px" : null} variant='h6'>CO-CURRICULAR ACIVITIES</Typography>
                        </Paper>
                    </Link>
                </Grid>
                {/* <img src="logo192.png" alt="" /> */}
                <Grid item lg={4}  md={4} sm={12} >
                    <Link to={'/student-overview/1'} onClick={handleClick}>
                        <Paper component={Stack} spacing={2} alignItems={'center'} p={mob ? 1 : 5} py={mob ? 3 : 7} pt={mob ? 4 : 9} m={2} sx={{ width: mob ? "270px" : null, borderRadius: mob?"11px":"16px", boxShadow: "0px 3px 6px 0px rgba(0,0,0,0.2)", borderRadius: "14px" }} >
                            <Image src={require('../../assets/Images/userImg/Academics@2x.png')} height={mob ? "90px" : '200px'} />
                            <Divider style={{ border: "0.5px solid #707070", width: "85%", marginTop: mob ? "32px" : "45px" }} />
                            <Typography style={{ marginTop: mob ? "18px" : "28px" }} fontSize={mob ? "12px" : null} variant='h6'>ACADEMICS</Typography>
                        </Paper>
                    </Link>
                </Grid>
            </Grid>
        </Container>
    )
}
