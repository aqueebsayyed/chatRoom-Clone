import React from "react";
import { setSelectedContact } from "../redux/features/layoutSlice";
import { useDispatch } from "react-redux";

// const chats = [
//   { name: "Richard Wilson", msg: "I will add you to our team...", avatar: "R" },
//   { name: "ICG chat", msg: "Let's discuss this tomorrow", avatar: "IC" },
//   { name: "Sarah Parker", msg: "Ok, see you soon!", avatar: "S" },
//   { name: "Abubakar Campbell", msg: "Do you think we can do it?", avatar: "A" },
//   { name: "Conner Garcia", msg: "Hey, maybe we can meet...", avatar: "C" },
// ];

const ChatList = ({contacts}) => {
const dispatch = useDispatch()

  return (
    <div className="bg-gray-800 text-gray-100 w-72 overflow-y-auto py-4">
      {contacts.map((chat, index) => (
        <div onClick={()=> dispatch(setSelectedContact(chat))} key={index} className="flex items-center space-x-4 p-2 hover:bg-gray-700 cursor-pointer">
          {/* <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">{chat.profilePicture}</div> */}
          <img className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center" src={chat.profilePicture} alt="" />
          <div className="flex flex-col">
            <span className="font-semibold">{chat.username}</span>
            {/* <span className="text-gray-400 text-sm">{chat.msg}</span> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
