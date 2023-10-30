
import { Link } from "react-router-dom";
import {
  AppBar,
  Box,
  useMediaQuery,
  IconButton,
  Button,
  Toolbar, Typography,
  Container,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Image } from "react-bootstrap";
import { useProSidebar } from "react-pro-sidebar";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import UpdateIcon from '@mui/icons-material/Update';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import LogoutIcon from '@mui/icons-material/Logout';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';


function PositionedMenu() {

  const mob = useMediaQuery("(max-width:986px)");
  const { studentDetails } = useSelector(state => state.infra)
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    dispatch(logout());
  };

  const [loginUUser, setLoginUUser] = useState("");

  useEffect(() => {
    if (
      localStorage.getItem("username") &&
      localStorage.getItem("username") !== ""
    ) {
      setLoginUUser(localStorage.getItem("username"));
    }
  }, []);

  return (
    <div>
      <Button
        id="demo-positioned-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {studentDetails && studentDetails.profile_image ? (
          studentDetails.profile_image ? (
            <Image
              src={"https://cyber-tutor-x-backend.vercel.app/" + studentDetails.profile_image}
              height={mob ? 25 : 25}
              width={mob ? 25 : 25}
              style={{ marginRight: 4, borderRadius: "50px" }}
            />
          ) : (
            <Image
              src={require("../assets/Images/profile.png")}
              height={mob ? 25 : 25}
              width={mob ? 25 : 25}
              style={{ marginRight: 4, borderRadius: "50px" }}
            />
          )
        ) : (
          <Image
            src={require("../assets/Images/profile.png")}
            height={mob ? 30 : 30}
            width={mob ? 30 : 30}
            style={{ marginRight: 4, borderRadius: "50px" }}
          />
        )} {" "}
        {loginUUser || "admin"}
        <ArrowDropDownIcon />
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        // style={{ top: "36px", left: "1473px" }}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem
          onClick={() => {
            navigate("/student-details");
            setAnchorEl(null);
          }}
        >
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}


export default function UserHeader() {
  const { studentDetails } = useSelector(state => state.infra)
  const dispatch = useDispatch();
  const matches = useMediaQuery('(max-width:768px)');
  const mob = useMediaQuery("(max-width:800px)");
  const { collapseSidebar } = useProSidebar();
  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setStateOpen(open);
  };
  const [stateOpen, setStateOpen] = useState(false);

  const list = () => (
    <Box
      sx={{ width: 250, height: "100%" }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >

      <Divider />
      <Box sx={{ backgroundColor: 'white', padding: 2, height: '100%', width: '100%', paddingBottom: "2px" }}>
        <Stack spacing={2} direction={'column'} justifyContent={"space-between"} style={{ height: "100%" }}>
          <Stack spacing={2} direction={'column'} >
            <Box>
              {studentDetails.profile_image == "" || studentDetails.profile_image == undefined || studentDetails.profile_image == null ? (<Image src={require('../assets/Images/profile.png')} width={'100'} style={{ borderRadius: "100px" }} />) : (<Image src={"https://cyber-tutor-x-backend.vercel.app/" + studentDetails.profile_image} width={'100'} height={'100'} style={{ borderRadius: "100px" }} />)}
              <Typography variant='h5' fontSize={20}>{studentDetails?.student_details?.first_name}</Typography>
              <Link
                className="secondary"
                to={'/student-details'}
                style={{ marginTop: "0px", marginBottom: "0px", display: "flex", cursor: "pointer", alignItems: "center", color: "#43B5C1", fontSize: "12px" }}
              > View Profile
              </Link>
            </Box>
            <Box  >
              <Divider sx={{ borderWidth: mob ? "1.1px" : "1.8px", marginBottom: "10px", borderColor: '#707070' }} />
              <table>
                <tbody>
                  <tr>
                    <td><Typography variant='h6' style={{ fontSize: mob ? "12px" : "14px" }}>Class : </Typography></td>
                    <td> &nbsp; &nbsp;</td>
                    <td><Typography variant='h6' style={{ textTransform: "capitalize", fontSize: mob ? "11px" : "13px" }}> {studentDetails.class_name}</Typography></td>
                  </tr>
                  <tr>
                    <td><Typography variant='h6' style={{ fontSize: mob ? "12px" : "14px" }}>Section : </Typography></td>
                    <td> &nbsp; &nbsp;</td>
                    <td><Typography variant='h6' style={{ textTransform: "capitalize", fontSize: mob ? "11px" : "13px" }}>{(studentDetails.section || "A").toUpperCase()}</Typography></td>
                  </tr>
                  <tr>
                    <td><Typography variant='h6' style={{ fontSize: mob ? "12px" : "14px" }}>Registration No. : </Typography></td>
                    <td> &nbsp; &nbsp;</td>
                    <td><Typography variant='h6' style={{ textTransform: "capitalize", fontSize: mob ? "11px" : "13px" }}> {studentDetails.registration_no}</Typography></td>
                  </tr>
                  <tr>
                    <td><Typography variant='h6' style={{ fontSize: mob ? "12px" : "14px" }}>Session : </Typography></td>
                    <td> &nbsp; &nbsp;</td>
                    <td><Typography variant='h6' style={{ textTransform: "capitalize", fontSize: mob ? "11px" : "13px" }}> {studentDetails.session}</Typography></td>
                  </tr>
                </tbody>
              </table>
              <Divider sx={{ borderWidth: mob ? "1.1px" : "1.8px", marginTop: "10px", borderColor: '#707070' }} />
            </Box>
          </Stack>
          <Stack spacing={2} direction={'column'} bottom={0}>
            <Divider sx={{ borderWidth: mob ? "1.1px" : "1.8px", marginTop: "10px", borderColor: '#707070', opacity: "50%" }} />
            <Stack direction={'row'} alignItems={"center"} mx={1}>
              <DiamondOutlinedIcon style={{ width: mob ? "15px" : "20px", height: "auto" }} />
              <Button style={{ marginRight: "5px", color: "#3D3D3D", fontSize: mob ? "10px" : "12px", fontWeight: "600" }} component={Link} to={'/subscription'}>Subscription</Button>
            </Stack>
            <Stack direction={'row'} alignItems={"center"} mx={1}>
              <SettingsIcon style={{ width: mob ? "15px" : "20px", height: "auto" }} />
              <Button style={{ marginRight: "5px", color: "#3D3D3D", fontSize: mob ? "10px" : "12px", fontWeight: "600" }}>Settings</Button>
            </Stack>
            <Stack direction={'row'} alignItems={"center"} mx={1}>
              <HelpOutlineIcon style={{ width: mob ? "15px" : "20px", height: "auto" }} />
              <Button style={{ marginRight: "5px", color: "#3D3D3D", fontSize: mob ? "10px" : "12px", fontWeight: "600" }}>Help Center</Button>
            </Stack>
            <Stack direction={'row'} alignItems={"center"} mx={1}>
              <LogoutIcon style={{ width: mob ? "15px" : "20px", height: "auto" }} />
              <Button onClick={handleLogout} style={{ marginRight: "5px", color: "#3D3D3D", fontSize: mob ? "10px" : "12px", fontWeight: "600" }}>Logout</Button>
            </Stack>
            <Divider sx={{ borderWidth: mob ? "1.1px" : "1.8px", marginTop: "10px", borderColor: '#707070', opacity: "50%" }} />
          </Stack>
        </Stack>
      </Box>
    </Box>
  );


  useEffect(() => {
    setTimeout(() => {
      mob ? collapseSidebar(true) : collapseSidebar(false);
    }, 200);
  }, [mob]);

  const navigate = useNavigate();
  return (
    <AppBar
      sx={{
        backgroundColor: "white",
        backdropFilter: "blur(10px)",
        width: "100%",
        boxShadow: "1px 1px 6px -1px #00000029"
      }}
      elevation={2}
      position="fixed"
    >
      <Container disableGutters maxWidth="xxl">
        
        <Toolbar sx={{ minHeight: mob ? 50 : 50 }}>
          <Box
            display={"flex"}
            justifyContent="space-between"
            width={"100%"}
            alignItems="center"
          >
            {!mob ? (studentDetails && studentDetails.school_details ? (
              studentDetails.school_details.logo ? (
                <Image
                  src={studentDetails.school_details.logo}
                  height={mob ? 20 : 30}
                  style={{ marginLeft: 5 }}
                />
              ) : (
                <Image
                  src={require("../assets/Logo/noimage.png")}
                  height={mob ? 20 : 30}
                  style={{ marginLeft: 5 }}
                />
              )

            ) : (
              <Image
                src={require("../assets/Logo/noimage.png")}
                height={mob ? 20 : 30}
                style={{ marginLeft: 5 }}
              />
              
            )) : (
              <div>
                <IconButton style={{ padding: "0" }} onClick={toggleDrawer(true)}>
                  {studentDetails && studentDetails.profile_image ? (
                    studentDetails.profile_image ? (
                      <Image
                        src={studentDetails.profile_image}
                        height={mob ? 40 : 40}
                        width={mob ? 40 : 40}
                        style={{ marginLeft: 0, borderRadius: "50px" }}
                      />
                    ) : (
                      <Image
                        src={require("../assets/Images/profile.png")}
                        height={mob ? 40 : 40}
                        width={mob ? 40 : 40}
                        style={{ marginLeft: 0, borderRadius: "50px" }}
                      />
                    )
                  ) : (
                    <Image
                      src={require("../assets/Images/profile.png")}
                      height={mob ? 40 : 40}
                      width={mob ? 40 : 40}
                      style={{ marginLeft: 0, borderRadius: "50px" }}
                    />
                  )}
                </IconButton>
                <Drawer
                  anchor={"left"}
                  open={stateOpen}
                  onClose={toggleDrawer(false)}
                >
                  {list()}
                </Drawer>
              </div>
            )}
            <Typography variant="h5" color="black">{studentDetails.school_details?.name.toUpperCase()}</Typography>
            <Link to={'/'}>
            <Typography variant="h4" color="blue">GYSP</Typography>
            </Link>
            {mob ? (<Stack direction={"row"} alignItems="center">
              
              <IconButton>
                <NotificationsNoneIcon color="primary" style={{ fontSize: "26px" }} />
              </IconButton>
            </Stack>
            ) : (<Stack direction={"row"} alignItems="center">
              <IconButton onClick={() => {
                navigate("/subscription");
              }}>
                {/* <UpdateIcon style={{ color: "#ffb743" }} /> */}
                <Image
                  src={require("../assets/Images/crown.png")}
                  width={mob ? 15 : 15}
                  style={{ marginRight: "3px" }}
                />
                <Typography>Upgrade</Typography>
              </IconButton>
              <IconButton>
                <NotificationsNoneIcon color="primary" />
              </IconButton>
              <IconButton><HelpOutlineIcon color="primary" /></IconButton>
              <PositionedMenu />
            </Stack>)}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
