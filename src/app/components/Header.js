import React from "react";
import { MenuIcon } from "@heroicons/react/solid";
import { useNavigate } from "react-router-dom";
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
function Header() {
  // const navItems = [];
  const navigate = useNavigate();
  return (
    <header className="container flex justify-between shadow-md md:shadow-none h-20 ">
      <img
        className="md:hidden lg:inline-flex"
        src="./logo-white.png"
        alt=""
        width="180"
      />
      <img
        className="hidden md:inline-block lg:hidden"
        src="./images/logo.svg"
        alt=""
        width="45"
      />
      <div className="flex items-center">
        <MenuIcon className="h-10 md:hidden" />
        <div className="hidden md:flex items-center space-x-3 lg:space-x-8">
        <Typography variant="h4" color="blue">GYSP</Typography>

          <button className="secondary-button">Sign in</button>
          <button className="primary-button"  onClick={() => {
  navigate('/register-school');
}}>Sign up</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
