import React from "react";
import { MenuIcon } from "@heroicons/react/solid";
import { useNavigate } from "react-router-dom";
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
          {/* <div className="hidden max-w-xl md:grid gap-4 grid-cols-4 text-right"> */}
          {/* </div> */}

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
