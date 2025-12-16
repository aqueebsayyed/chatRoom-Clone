import React from "react";

const MessageBubble = ({ message, currentUser }) => {
  const isUserMessage = message.sender._id === currentUser?._id;
  const bubbleAlign = isUserMessage ? "justify-end" : "justify-start";
  const bubbleColor = isUserMessage
    ? "bg-blue-500 text-white"
    : "bg-gray-700 text-gray-200";

  return (
    <div className={`flex ${bubbleAlign} mb-2`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${bubbleColor}`}>
        {/* Sender name only if it's not current user */}
        {!isUserMessage && (
          <span className="block font-semibold text-sm text-yellow-300">
            {message.sender.name}
          </span>
        )}

        {/* Message content */}
        <p className="text-sm">{message.content}</p>

        {/* Message time */}
        <span className="block text-xs text-gray-300 mt-1 text-right">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
