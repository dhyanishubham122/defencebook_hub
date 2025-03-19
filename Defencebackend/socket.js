const User = require('./models/User');
const Conversation = require('./models/conversation');

const onlineUsers = new Map(); // userId -> [socketId1, socketId2]





module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    for (let [key, value] of onlineUsers) {
        console.log("here is key and value key is "+key + " is " + value);
    }
    // Handle user coming online
    socket.on('userOnline', async (userId) => {
      try {
        const user = await User.findById(userId);
        console.log("user.naem",user.username);
        if (user && user.chatEnabled) {
          if (!onlineUsers.has(userId)) {
            onlineUsers.set(userId, []);
          }
          onlineUsers.get(userId).push(socket.id);
          console.log(`User ${user.username} is online`);

          // Fetch and broadcast online users
          const enabledUsers = await User.find({ chatEnabled: true }).select('_id username');
          io.emit('onlineUsers', enabledUsers);
        }
      } catch (error) {
        console.error('Error handling user online:', error);
      }
    });

    // Handle real-time messaging
    socket.on('sendMessage', async ({ conversationId, senderId, receiverId, content }) => {
      try {
        let newMessage = {
          sender: senderId,
          content,
          timestamp: new Date(),
          read: false,
        };

        let conversation = await Conversation.findByIdAndUpdate(
          conversationId,
          { 
            $push: { messages: newMessage }, 
            $set: { lastMessage: newMessage }
          },
          { new: true }
        );

        if (!conversation) return;

        // Broadcast the message to the receiver
        const receiverSocketIds = onlineUsers.get(receiverId) || [];
        receiverSocketIds.forEach(socketId => {
          io.to(socketId).emit('receiveMessage', newMessage);
        });

        // Send the message back to the sender
        // socket.emit('receiveMessage', newMessage);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    // Handle user disconnecting
    socket.on('disconnect', () => {
      for (let [userId, socketIds] of onlineUsers.entries()) {
        const updatedSockets = socketIds.filter(id => id !== socket.id);
        if (updatedSockets.length > 0) {
          onlineUsers.set(userId, updatedSockets);
        } else {
          console.log(`User ${userId} disconnected`);
          onlineUsers.delete(userId);
        }
      }

      // Broadcast updated online users list
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
    });
  });
};

// nkdjkhfhjkqhfhasdc khd dbd gi ig