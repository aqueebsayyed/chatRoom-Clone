import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversation, fetchMessage, sendMessage } from "../services/conversation.service";
import { addMessage, setConversations, setMessages } from "../redux/features/chatSlice";
import { isToday, isYesterday, format } from "date-fns"
import MessageBubble from "./MessageBubble";
// import useSocket from "../services/socket.service";

const ChatWindow = () => {
  const dispatch = useDispatch()
  const { conversations } = useSelector((state) => state.chat)
  const { messages,userStatus } = useSelector((state) => state.chat)
  const { selectedContact } = useSelector(state => state.layout)
  const { user } = useSelector(state => state.auth)
  const [msgContent, setMsgContent] = useState("")

  console.log(userStatus);
  
  const status = userStatus[selectedContact?._id]
  // console.log(status)


  const handleMessageSend = async () => {
    try {
      let messageData = {
        senderId: user?._id,
        receiverId: selectedContact?._id,
        content: msgContent
      }
      const response = await sendMessage(messageData)
      if (response.status === "success") {
        setMsgContent("");
        dispatch(addMessage(response.data));
      }
    } catch (error) {
      console.error(error)
    }
  }

  const isValidate = (date) => {
    return date instanceof Date && !isNaN(date);
  };

  const groupedMessages = Array.isArray(messages)
    ? messages?.reduce((acc, message) => {
      if (!message.createdAt) return acc;
      const date = new Date(message.createdAt);

      if (isValidate(date)) {
        const dateString = format(date, "yyyy-MM-dd");

        if (!acc[dateString]) {
          acc[dateString] = [];
        }

        acc[dateString].push(message);
      } else {
        console.error("Invalid date for message", message);
      }

      return acc;
    }, {})
    : {};

  const renderDateSeperator = (date) => {
    if (!isValidate(date)) {
      return null;
    }

    let dateString;

    if (isToday(date)) {
      dateString = "Today";
    } else if (isYesterday(date)) {
      dateString = "Yesterday";
    } else {
      date = format(date, "EEEE, MMMM d");
    }

    return (
      <div className="flex justify-center my-4">
        <span
          className="px-4 py-2 rounded-full text-sm  bg-gray-700 text-gray-500"
        >
          {dateString}
        </span>
      </div>
    );
  };

  const conversation = async () => {
    try {
      let response = await fetchConversation()
      if (response.status == "success") {
        dispatch(setConversations(response.data))
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    conversation()
  }, [])


  useEffect(() => {
    const getMessages = async () => {
      if (!conversations || !selectedContact?._id) return;

      if (selectedContact?._id && conversations?.length > 0) {
        const conversationId = conversations.find((conv) => {
          return conv.participants.some(
            (participant) => participant?._id !== selectedContact?._id
          );
        });

        if (conversationId?._id) {
          let response = await fetchMessage(conversationId._id);
          dispatch(setMessages(response?.data))
        }
      }
    };

    getMessages();


  }, [conversations, selectedContact])



  return (
    <div className="flex-1 bg-gray-900 text-gray-100 p-4 flex flex-col">
      {/* Chat image */}
      {!selectedContact ? (
        <div>No Contact Selected</div>
      ) : (
        <>
          <div className="mb-4 flex gap-2 items-center">
            <img
              src={selectedContact?.profilePicture}
              alt="chat banner"
              className="w-12 h-12 rounded-full  object-cover"
            />
            <div>
            <h2 className="text-sm ">{selectedContact?.username}</h2>
            <span>{status?.isOnline ? "Online" : user.lastSeen}</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3">
            {/* {messages.map((msg, index) => (
              <div key={index} className="flex flex-col">
                <span className="font-semibold">{msg.sender}</span>
                <span className="text-gray-400">{msg.msg}</span>
                <span className="text-gray-500 text-xs self-end">{msg.time}</span>
              </div>
            ))} */}
            {Object.entries(groupedMessages).map(([date, msgs]) => (
              <React.Fragment key={date}>
                {renderDateSeperator(new Date(date))}
                {msgs.filter((msg) => msg.conversation === selectedContact?.conversation?._id
                ).map((msg) => (
                  <MessageBubble
                    key={msg._id}
                    message={msg}
                    currentUser={user}
                  />
                ))
                }
              </React.Fragment>
            ))}



          </div>

          {/* Input */}
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="text"
              value={msgContent}
              placeholder="Write a message..."
              className="flex-1 p-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none"
              onChange={(e) => setMsgContent(e.target.value)}
            />
            <button onClick={handleMessageSend} className="bg-yellow-400 text-black px-4 py-2 rounded-lg">
              Send
            </button>
          </div>
        </>
      )}

    </div>

  );
};

export default ChatWindow;
