import { AppBar, Box, useMediaQuery, IconButton, Button, Toolbar, Container, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Stylesheet from "reactjs-stylesheet";
import { Image } from "react-bootstrap";
import { useProSidebar } from "react-pro-sidebar";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Menu from "@mui/material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/AuthSlice";
import { useNavigate } from "react-router-dom";


function PositionedMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    navigate('/');
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
        aria-controls={open ? "demo-positioned-menu" : false}
        aria-haspopup="true"
        aria-expanded={open ? "true" : false}
        onClick={handleClick}
        style={{ textTransform: "math-auto" }}
      >
        {loginUUser || "admin"}
        <ArrowDropDownIcon />
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
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
            navigate("/admin-profile");
            handleClose()
          }}
        >
          Profile
        </MenuItem>
        {/* <MenuItem onClick={handleClose}>Change Password</MenuItem> */}
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}

export default function Header() {
  const matches = useMediaQuery("(max-width:768px)");
  const mob = useMediaQuery("(max-width:986px)");
  const { collapseSidebar } = useProSidebar();
  const styles = Stylesheet.create({
    menuStyle: {
      "&.active": {
        backgroundColor: "primary.light",
        color: "primary.main",
      },
      textTransform: "capitalize",
      fontWeight: "bold",
    },
  });

  useEffect(() => {
    setTimeout(() => {
      mob ? collapseSidebar(true) : collapseSidebar(false);
    }, 200);
  }, []);
  return (
    <AppBar
      sx={{
        backgroundColor: "white",
        backdropFilter: "blur(10px)",
        width: "100%",
      }}
      elevation={1}
      position="static"
    >
      <Container disableGutters maxWidth={mob ? "xl" : "xxl"}>
        <Toolbar sx={{ minHeight: mob ? 40 : 50 }}>
          <Box
            display={"flex"}
            justifyContent="space-between"
            width={"100%"}
            alignItems="center"
          >
            {mob ? null : (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={() => collapseSidebar()}
              >
                <MenuIcon color="primary" />
              </IconButton>
            )}
            <Image
              src={require("../assets/Logo/logo2x.png")}
              height={mob ? 20 : 30}
              style={{ marginLeft: 40 }}
            />
            <Stack direction={"row"} alignItems="center">
              <IconButton>
                <NotificationsNoneIcon color="primary" />
              </IconButton>
              <IconButton>
                <HelpOutlineIcon color="primary" />
              </IconButton>
              <PositionedMenu />
            </Stack>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
