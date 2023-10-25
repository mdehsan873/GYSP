import React from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Box, Stack } from '@mui/material';

export default function AccordionWrapper({ children, name, title, icon, setExpanded, expanded }) {

    const handleExpanedChange = (panel) => (isExpanded) => {
        if (expanded === panel) {
            setExpanded("");
        } else {
            setExpanded(isExpanded ? panel : false);
        }
    };
    return (
        <Box marginTop={2} >
            <Accordion expanded={expanded === name} style={{ boxShadow: "0px 3px 6px 0px rgba(0,0,0,0.2)", }} onChange={handleExpanedChange(name)}>
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon style={{ color: "#D3D0D0", fontSize: "50px" }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    style={{ padding: "8px", paddingLeft: "22px" }}
                >
                    <Stack direction={'row'} spacing={2}>
                        {icon}
                        <Typography>{title}</Typography>
                    </Stack>
                </AccordionSummary>
                <AccordionDetails>
                    {children}
                </AccordionDetails>
            </Accordion>
        </Box>
    )
}
