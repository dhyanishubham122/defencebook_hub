import React, { useContext, useEffect, useState } from "react";
import { UserAuthContext } from "../../context/UserAuthContext";
import ChatBox from "../components/ChatBox";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:4000", { autoConnect: false }); // Prevent auto-connect

function Chat() {
  const navigate = useNavigate();

  const { logout,login } = useContext(UserAuthContext);
  const [chatStatus, setChatStatus] = useState(false);
  const [onlineUser, setOnlineUser] = useState([]);
  const [senderID, setSenderId] = useState(null);
  const [token, setToken] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
  const [recivername, setRecivername] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // Store token in localStorage & AuthContext
      login({ token });
      localStorage.setItem("User", JSON.stringify({ token }));

      // Remove token from URL after storing
      setTimeout(() => {
        navigate("/chat", { replace: true });
      }, 1000);
    }
  }, [navigate, login]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("User"));
    if (user?.token) {
      setToken(user.token);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:4000/user/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setSenderId(data.id);

        // Connect socket and register user
        socket.connect();
        socket.emit("userOnline", data.id);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();

    return () => {
      socket.disconnect(); // Clean up on unmount
    };
  }, [chatStatus]);

  useEffect(() => {
    if (!token) return;
    const fetchChatStatus = async () => {
      try {
        const response = await fetch("http://localhost:4000/user/chat-status", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Unable to fetch chat status");
        const data = await response.json();
        setChatStatus(data.chatEnabled);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchChatStatus();
  }, [token]);

  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        return [...safePrev, newMessage];
      });
        // Mark message as read immediately if chat is open and sender is same
    // if (newMessage.senderId === receiverId) {
    //   console.log("cmversation id :",conversationId+" send id :",senderId+"reciverId:",receiverId);
    //   readmessages(conversationId, senderID);
    // }
    });

    socket.on("onlineUsers", (users) => {
      console.log("online users ",users);
      setOnlineUser(users);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("onlineUsers");
    };
  }, []);

  const toggleStatus = async () => {
    try {
      const response = await fetch("http://localhost:4000/user/toggle-chat", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Unable to enable/disable chat");
      const data = await response.json();
      setChatStatus(data.chatEnabled);
    } catch (error) {
      console.error(error.message);
    }
  };

  const initiateConversation = async (receiverId, name) => {
    try {
      const response = await fetch("http://localhost:4000/user/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ senderId: senderID, receiverId }),
      });
      if (!response.ok) throw new Error("Failed to create conversation");
      const data = await response.json();
      setConversationId(data._id);
      setReceiverId(receiverId);
      setRecivername(name);
      setIsChatBoxOpen(true);
      fetchMessages(data._id,receiverId);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const fetchMessages = async (conversationId,receiverId) => {
    try {
      const response = await fetch(`http://localhost:4000/user/chat/${conversationId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      setMessages(data);
      readmessages(conversationId,receiverId)
    } catch (error) {
      console.error(error.message);
    }
  };

  const readmessages=async (conversationid,receiverId)=>{
    try{
      const response=await fetch("http://localhost:4000/user/markasread",{
        method:"POST",
        headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          },
          body:JSON.stringify({conversationid,receiverId})
          });
          if(!response.ok)throw new Error("Failed to mark as read");
          const data=await response.json();
          console.log("msg read checkin",data);

  }
  catch(err){
  console.log(err);
  }
}
  const sendMessage = (content) => {
    if (!content.trim()) return;

    const newMessage = { conversationId, senderId: senderID, receiverId, content };
    setMessages((prev) => (Array.isArray(prev) ? [...prev, { sender: senderID, content, timestamp: new Date(), read: false }] : [{ sender: senderID, content, timestamp: new Date(), read: false }]));

    socket.emit("sendMessage", newMessage);

  };

  return (
    <>
      <div className="mt-[62px] bg-gray-300 flex flex-col items-center justify-center relative">
        <button className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={logout}>
          Logout
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Welcome to Global Chat</h1>
        </div>

        {/* <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <p className="text-gray-700 font-medium">Enable Chat:</p>
          <input type="checkbox" checked={chatStatus} onChange={toggleStatus} className="peer appearance-none w-full h-full cursor-pointer" />
          <p className={`text-sm font-semibold ${chatStatus ? "text-green-600" : "text-red-600"}`}>{chatStatus ? "ON" : "OFF"}</p>
        </div> */}
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
      className={`absolute top-0 left-0 w-7 h-7 bg-white rounded-full shadow-md transform transition-transform duration-300 border-2 ${
        chatStatus ? "translate-x-7 border-green-500" : "translate-x-0 border-red-500"
      }`}
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
              {onlineUser.filter((user) => user._id !== senderID).map((user, index) => (
                <div key={index} className="p-3 border-b last:border-none cursor-pointer flex items-center space-x-3 mt-2" onClick={() => initiateConversation(user._id, user.username)}>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
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

      {isChatBoxOpen && <ChatBox conversationId={conversationId} messages={messages} senderID={senderID} recivername={recivername} onSendMessage={sendMessage} onClose={() => setIsChatBoxOpen(false)} />}
    </>
  );
}

export default Chat;
