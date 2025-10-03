import React from "react";
import { Input } from "./ui/input";
import AuthProfile from "./authProfile";

const Header = async () => {
  return (
    <div className="grid grid-cols-3 my-4">
      <div className="flex justify-start">
        <h1 className="font-bold text-xl">Discuss</h1>
      </div>
      <div className="justify-center flex">
        <Input type="text" placeholder="Search..." />
      </div>
      <div className="flex justify-end gap-4">
        <AuthProfile />
      </div>
    </div>
  );
};

export default Header;
