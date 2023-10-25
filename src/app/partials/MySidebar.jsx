import React from 'react'
import { Sidebar, Menu, MenuItem, } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import SportsSoccerOutlinedIcon from '@mui/icons-material/SportsSoccerOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';

export default function MySidebar() {
    return (
        <div style={{ display: 'flex', height: 'revert', fontFamily: 'roboto', backgroundColor: 'white' }}>

            <Sidebar width='200px' >
                <Menu
                    style={{ backgroundColor: "#fff" }}
                    menuItemStyles={{
                        button: ({ level, active, disabled }) => {
                            // only apply styles on first level elements of the tree
                            if (level === 0)
                                return {
                                    backgroundColor: active ? '#dcfbfc' : 'white',
                                };
                        },
                    }}>
                    <MenuItem component={<Link to="/" />} icon={<HomeOutlinedIcon />}> Home</MenuItem>
                    <MenuItem component={<Link to="/students" />} icon={<SchoolOutlinedIcon />}> Students</MenuItem>
                    <MenuItem component={<Link to="/results" />} icon={<AssessmentOutlinedIcon />}> Results</MenuItem>
                    <MenuItem component={<Link to="/cocurricular" />} icon={<SportsSoccerOutlinedIcon />}> Co-curricular</MenuItem>
                    <MenuItem component={<Link to="/billing" />} icon={<CreditCardOutlinedIcon />}> Billing</MenuItem>
                </Menu>
            </Sidebar>
        </div>)
}
