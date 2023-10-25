
import { Box, Typography, IconButton } from '@mui/material'
import React from 'react'

export default function InfoBox({ onPresIcon, IconTag, Head, Desc }) {
    return (
        <Box sx={{ display: 'flex', mb: 3 }}>
            <Typography sx={{ flex: 0.5, fontWeight: 'bold', fontSize:"14px" }} >{Head}</Typography>
            <Typography sx={{ flex: 0.5, color: "#797979", fontSize:"12px" }}>{Desc}   <IconButton sx={{ padding: "0 3px", width: "16px" }} onClick={onPresIcon}>{IconTag}</IconButton> </Typography>
        </Box>
    )
}
