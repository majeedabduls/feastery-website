// server.js (complete example)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Simple route
app.get('/', (req, res) => {
  res.send('Feastery Backend is running!');
});

// ----- MONGOOSE CONNECT (verbose, recommended options) -----
const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
  try {
    // options make topology stable for Atlas
    await mongoose.connect(MONGO_URI);

    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Error:', err);
  }
}

connectDB();

// Add connection event listeners to see what's happening
mongoose.connection.on('connected', () => console.log('Mongoose event: connected'));
mongoose.connection.on('disconnected', () => console.log('Mongoose event: disconnected'));
mongoose.connection.on('reconnected', () => console.log('Mongoose event: reconnected'));
mongoose.connection.on('error', (err) => console.error('Mongoose event: error', err));

// ----- START SERVER -----
const PORT = process.env.PORT || 5000;
app.use('/uploads', express.static('uploads'));
app.use('/products', productRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes);
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

