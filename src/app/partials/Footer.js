import { Box, Typography, useMediaQuery } from '@mui/material'
import React from 'react'

export default function Footer() {

    const mob = useMediaQuery('(max-width:800px)')
    return (
        <Box
            style={{
                background: "transparent",
                margin: "0",
                display: "flex",
                width: "100%",
                // position :"fixed",
                bottom: "0",
                zIndex: "-111"
                // position: "fixed", left: "0px", bottom: "0px", width: "100%", textAlign:"center"
            }}
        >
            <Typography textAlign={'center'} margin={0} fontSize={mob ? "12px" : null} style={{ background: "transparent", margin: 0, width: "100%", marginBottom: "5px" }}>
                Made with <span className="text-red-500 text-2xl">&#9829;</span> in India by BYTEBRILLIANCE TECHNOLOGIES
            </Typography>
        </Box>
    )
}
