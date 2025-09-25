import Link from "next/link";
import React from "react";

const navbar = () => {
  return (
    <nav className=" w-full flex items-center justify-between p-3 fixed top-0 z-10 bg-white">
      <Link href={`/`} className="text-3xl font-bold">
        Home
      </Link>
      <div className="flex items-center gap-3">
        <Link href={`/performance`} className="text-lg font-medium">
          Performance
        </Link>
        <Link href={`/reliability`} className="text-lg font-medium">
          Reliability
        </Link>
      </div>
    </nav>
  );
};

export default navbar;
