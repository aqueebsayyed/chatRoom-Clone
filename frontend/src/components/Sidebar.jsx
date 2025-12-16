import React from "react";
import { useNavigate } from "react-router-dom";
import { CiSettings } from "react-icons/ci";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { GiEgyptianProfile } from "react-icons/gi";

const Sidebar = () => {
    const navigate = useNavigate()
   const menu = [
    { label: 'Chat', path: '/' , Image:<IoChatboxEllipsesOutline />},
    { label: 'Profile', path: '/profile' , Image:<GiEgyptianProfile /> },
    { label: 'Settings', path: '/setting' ,Image:<CiSettings /> },
  ]
  return (
    <div className="bg-gray-900 text-gray-100 w-20 flex flex-col items-center py-4 space-y-4">
      <div className="text-sm font-bold">As Chat</div>
      {menu.map((item, index) => (
        <div key={index}   onClick={() => navigate(item.path)} className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-700 cursor-pointer">
         {item.Image}
        </div>
      ))}
      <button className="mt-auto w-12 h-12 flex items-center justify-center bg-yellow-400 rounded-full text-black text-xl font-bold">+</button>
    </div>
  );
};

export default Sidebar;
