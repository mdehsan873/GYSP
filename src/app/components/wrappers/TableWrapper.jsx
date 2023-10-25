import { Container } from '@mui/system'
import React from 'react'
import { Paper } from '@mui/material';
export default function TableWrapper({ children }) {
    return (
        <Container maxWidth="xxl" sx={{ maxWidth: "100%", border: 0, }}  >
            {/* <Box margin={2}>
                <Link onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center' }}><ArrowBackIosIcon /> Back</Link>
            </Box> */}
            <Paper sx={{ marginTop: 2, border: 0, boxShadow: "0px 1px 6px 0px rgba(0,0,0,0.2)", }}>
                {children}
            </Paper>
        </Container>
    )
}
