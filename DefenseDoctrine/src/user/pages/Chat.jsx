import React, { useContext, useEffect, useState } from "react";
import { UserAuthContext } from "../../context/UserAuthContext";
import ChatBox from "../components/ChatBox"; // Import the ChatBox component
/* chat stsus is use to check which user is online or not */ 
function Chat() {
  const { logout } = useContext(UserAuthContext);
  const [chatStatus, setChatStatus] = useState(false);
  const [onlineUser, setOnlineUser] = useState([]);
  const [senderID, setSenderId] = useState(null);
  const [token, setToken] = useState(null);
  const [receiverID, setReceiverId] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
  const [recivername,setRecivername]=useState('');
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("User"));
    if (user && user.token) {
      setToken(user.token);
    } else {
      console.log("No token available, user is not logged in.");
    }
  }, []);

useEffect(()=>{
if(!chatStatus){
  setIsChatBoxOpen(false)
}
},[chatStatus])

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:4000/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = await response.json();
        console.log("profiledata:", data);
        setSenderId(data.id);
        
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const fetchChatStatus = async () => {
      try {
        const response = await fetch("http://localhost:4000/user/chat-status", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Unable to fetch chat status");
        }

        const data = await response.json();
       
        setChatStatus(data.chatEnabled);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchChatStatus();
  }, [token]);

  const toggleStatus = async () => {
    try {
      const response = await fetch("http://localhost:4000/user/toggle-chat", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Unable to enable or disable chat");
      }

      const data = await response.json();
      setChatStatus(data.chatEnabled);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchOnlineUsers = async () => {
    try {
      const response = await fetch("http://localhost:4000/user/online-user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Unable to fetch online users");
      }

      const data = await response.json();
      setOnlineUser(data.onlineUsers);
      console.log("datais", data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (chatStatus) {
      fetchOnlineUsers();
    }
  }, [chatStatus]);

  // Create or fetch conversation
  const initiateConversation = async (receiverId,name) => {
    console.log("Receiver ID in initiate conversation:", receiverId);
    console.log("Receiver name in initiate conversation:", name);

    console.log("Sender ID in initiate conversation:", senderID);
    console.log("Token in initiate conversation:", token);
    try {
      const response = await fetch("http://localhost:4000/user/conversation", {
        method: "POST",
        headers: {
          "Content-Type":"application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ senderId: senderID, receiverId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create or fetch conversation");
      }
 console.log("initial conversation");
      const data = await response.json();
      setConversationId(data._id);
      setReceiverId(receiverId);
      setRecivername(name);
      setIsChatBoxOpen(true); // Open the chat box
      fetchMessages(data._id);
    } catch (error) {
      console.error("Error creating conversation:", error);
      if (error.response) {
        const errorData = await error.response.json();
        console.error("Backend error response:", errorData);
      }
    }
  };

  // Fetch messages of a conversation
  const fetchMessages = async (conversationId) => {
    try {
      const response = await fetch(`http://localhost:4000/user/chat/${conversationId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      if (data.message) {
        setMessages([]);
      } else {
        setMessages(data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Send message
  const sendMessage = async (content) => {
    if (!content.trim()) return;

    try {
      const response = await fetch("http://localhost:4000/user/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ conversationId, senderId: senderID, content }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <div className="mt-[62px] bg-gray-300 flex flex-col items-center justify-center relative">
        <button
          className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300"
          onClick={logout}
        >
          Logout
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Welcome to Global Chat</h1>
          <p className="text-gray-600 mt-2">Join the conversation with people around the world!</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <p className="text-gray-700 font-medium">Enable Chat:</p>
          <div className="relative inline-block w-14 h-7">
            <input
              type="checkbox"
              checked={chatStatus}
              onChange={toggleStatus}
              className="peer appearance-none w-full h-full bg-gray-200 rounded-full cursor-pointer transition-colors duration-300 checked:bg-green-500"
            />
            <label
              className={`absolute top-0 left-0 w-7 h-7 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                chatStatus ? "translate-x-7 border-green-500" : "translate-x-0 border-red-500"
              } border-2`}
            ></label>
          </div>
          <p className={`text-sm font-semibold ${chatStatus ? "text-green-600" : "text-red-600"}`}>
            {chatStatus ? "ON" : "OFF"}
          </p>
        </div>
      </div>

      {chatStatus ? (
        <>
          {onlineUser.length > 0 ? (
            <div className="fixed w-full max-w-sm bg-white p-4 rounded-lg shadow-lg overflow-y-auto max-h-80">
              {onlineUser.filter((user) => {return user._id !== senderID; }).map((user, index) => (
               
                <div
                  key={index}
                  className="p-3 border-b last:border-none bg hover:bg-gray-200 transition cursor-pointer flex items-center space-x-3 mt-2"
                  onClick={() => initiateConversation(user._id,user.username)}
                >
                   
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-gray-700 font-medium">{user.username}</p>
                </div>
              ))}
            </div>
          ) : (
            <h3>ALL are offline</h3>
          )}
        </>
      ) : (
        <h3>Sorry! You are offline</h3>
      )}

      {/* Render ChatBox if a conversation is selected */}
      {isChatBoxOpen && (
        <ChatBox
          conversationId={conversationId}
          messages={messages}
          senderID={senderID}
          recivername={recivername}
          onSendMessage={sendMessage}
          onClose={() => setIsChatBoxOpen(false)}
        />
      )}
    </>
  );
}

export default Chat;