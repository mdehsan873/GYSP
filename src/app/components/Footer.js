import React from "react";

function Footer() {
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-center mt-12">
        Made with <span className="text-red-500 text-2xl">&#9829;</span> in India by BYTEBRILLIANCE TECHNOLOGIES
      </p>
    </div>
  );
}

export default Footer;

export function Link({ text }) {
  return <p className="cursor-pointer mt-2">{text}</p>;
}
