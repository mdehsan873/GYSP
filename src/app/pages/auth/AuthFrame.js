import { Container, Box, Typography, useMediaQuery, Paper } from '@mui/material';
import React from 'react';

export default function AuthFrame({ children, title }) {
    const mob = useMediaQuery('(max-width:700px)');
    return (
        <Container sx={{ py: 2 }} maxWidth="xl">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: "100%",
                }}
            >
                <Paper elevation={1} sx={{ padding: mob ? 5 : 8, marginLeft: mob ? 2 : 12, marginRight: mob ? 2 : 12, marginBottom: 0 }}>
                    <Typography variant='h4' fontSize={mob ? 36 : null} fontWeight={'900'} color={"#03014C"}>
                        {title}
                    </Typography>
                    {children}
                </Paper>
            </Box>
        </Container>
    );
}
