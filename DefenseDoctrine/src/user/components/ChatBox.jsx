import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";

function ChatBox({ conversationId, messages, senderID, onSendMessage, onClose,recivername }) {
  const [messageContent, setMessageContent] = useState("");

  const handleSendMessage = () => {
    if (messageContent.trim()) {
      onSendMessage(messageContent);
      setMessageContent("");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="flex justify-between items-center p-4 bg-green-500 text-white rounded-t-lg">
        <h3 className="font-semibold">Chat with {recivername}</h3>
        <button onClick={onClose} className="text-white hover:text-gray-200">
        <RxCross2 />

        </button>
      </div>
      <div className="p-4 h-64 overflow-y-auto">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 ${
                message.sender === senderID ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  message.sender === senderID
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No messages yet. Start the conversation!</p>
        )}
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="bg-red-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;