import { PlayIcon } from "@heroicons/react/solid";
import React from "react";

function Hero() {
  return (
    // parent div
    <main className="container mt-4 md:flex flex-row-reverse justify-between items-center">
      <div className="md:max-w-[50%]">
      {/* <Login /> */}
      </div>

       {/* text section */}
      <div className="text-center sm:text-left md:max-w-[40%]">
        <h1 className="font-bold text-4xl leading-[60px]">
        Empowering Holistic Growth in Students with GYSP
        </h1>
        <p className="mt-4 text-[18px] leading-[28px] font-normal">
        Experience the Confluence of Academic Excellence and Co-Curricular Brilliance with Our Dynamic Reporting and Analytical Tools
        </p>
        <div className="mt-8 flex items-center justify-around sm:justify-start sm:space-x-8">
          <button className="primary-button">Get Started</button>
          
        </div>
      </div>
    </main>
  );
}

export default Hero;
