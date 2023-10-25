import { Box, Card, Paper, Stack, Typography } from '@mui/material'
import React from 'react'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Link } from 'react-router-dom';
export default function HomeCard({ icon, title, manage, countTitle, count, leftOptions, rightOptions }) {
    return (
        <Paper sx={{ padding: 3, margin: 2, minHeight: 270, borderRadius:"15px" }} elevation={3}>
            <Box>
                <Stack direction={'row'} justifyContent='space-between'>
                    <Stack direction={'row'} spacing={1}>
                        {icon}
                        <Typography fontWeight={'bold'}>{title}</Typography>
                    </Stack>
                    <Link to={manage} ><Typography className='secondary' >Manage</Typography></Link>
                </Stack>
            </Box>
            <Box marginTop={2} marginLeft={3}>
                <Typography  fontWeight={'bold'}>{countTitle} &nbsp;</Typography>
                <Typography variant='h4' fontSize={"24px"} fontWeight={'bold'}>{count} &nbsp;</Typography>
            </Box>
            <Grid2 container justifyContent={'space-between'} marginTop={10}  marginLeft={3}>
                <Grid2 lg={6} md={6} sm={12} sx={12} style={{display:"flex", flexDirection: "column", alignItems: "flex-start"}}>
                    {leftOptions ? leftOptions.map((item) => item) : null}
                </Grid2>
                <Grid2 lg={6} md={6} sm={12} sx={12} style={{display:"flex", flexDirection: "column", alignItems: "flex-start",}}>
                    {rightOptions ? rightOptions.map((item) => item) : null}
                </Grid2>
            </Grid2>
        </Paper>
    )
}
