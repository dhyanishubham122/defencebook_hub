const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDb = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const path = require('path');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDb();

// Enable CORS for all requests
app.use(cors({ origin: 'http://localhost:5173' }));

// ✅ Set CORS Headers for Static Files (Before Serving)
app.use('/uploads', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    next();
});

// ✅ Serve Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());

app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

app.get('/', (req, res) => res.send('Backend is running!'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
