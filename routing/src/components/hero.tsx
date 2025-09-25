import Image from "next/image";
import React from "react";
import Screenshot from "public/Screenshot from 2025-09-24 13-58-30.png";

const Hero = () => {
  return (
    <div className="mt-14 min-h-screen w-full">
      <Image src={Screenshot} alt="Next JS Logo" className=" h-full" />
    </div>
  );
};

export default Hero;
