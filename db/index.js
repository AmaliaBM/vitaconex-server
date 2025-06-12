const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const x = await mongoose.connect(process.env.MONGODB_URI);
    const dbName = x.connections[0].name;
    console.log(`Connected to Mongo! Database name: "${dbName}"`);
  } catch (err) {
    console.error('Error connecting to mongo:', err);
  }
};

module.exports = connectDB;
