import { Container, Box, Card, Typography, useMediaQuery, Paper } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import React from 'react'
import { Image } from 'react-bootstrap'


export default function AuthFrame({ children, title }) {
    const mob = useMediaQuery('(max-width:600px)');
    return (
        <Container sx={{ py: 2, background: "#f7fafa", height: window.innerHeight }} maxWidth={mob ? 'xs' : 'xxl'}>
            <Box textAlign={'right'}>
                
            </Box>
            <Grid2 container sx={{ alignItems: 'center', justifyContent: 'center', height: "92%" }} mt={mob ? (0) : (0)}>
                <Grid2 md={6} lg={6} xl={5} sm={12} style={mob ? { width: '100%' } : null}>
                    <Paper elevation={2} sx={{ padding: mob ? 5 : 8, marginLeft: mob ? 2 : 12, marginRight: mob ? 2 : 12, marginBottom: 0 }}>
                        <Typography variant='h4' fontSize={mob ? (36) : (null)} fontWeight={'900'} color={"#03014C"}>{title}</Typography>
                        {children}
                    </Paper>
                </Grid2>
                {mob ? (null) : (<Grid2 md={5} lg={5} sm={12} xl={5}  >
                    
                </Grid2>)}
            </Grid2>
        </Container>
    )
}
