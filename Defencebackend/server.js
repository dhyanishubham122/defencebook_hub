const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDb = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const contactroutes=require('./routes/contact');
const session = require('express-session');
const passport=require('passport');
require('./passport');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
dotenv.config();
const app = express();
connectDb();

const server = createServer(app);

const PORT = process.env.PORT || 4000;
// app.use(helmet());
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

// Enable CORS for all requests
// seesion manegment for passport thi is sesion middleware
app.use(
    session({
      secret: process.env.SESSION_SECRET, // Change this to a secure secret
      resave: false,
      saveUninitialized: true,
    })
  );
// 🔹 Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());
// Set CORS Headers for Static Files (Before Serving)
app.use('/uploads', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    next();
});

// Serve Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const io=new Server(server,{
    cors:{
       origin: '*',
    }
});
require('./socket')(io)

app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/contact',contactroutes);

app.get('/', (req, res) => res.send('Backend is running!'));

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
