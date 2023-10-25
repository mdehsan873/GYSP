import { Box, CircularProgress } from '@mui/material'
import React from 'react'

export default function Loader1() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
    )
}
