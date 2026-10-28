const mongoose = require('mongoose');

let pendingConnection;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (mongoose.connection.readyState === 2 && pendingConnection) return pendingConnection;
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not configured.');

  pendingConnection = mongoose.connect(process.env.MONGO_URI)
    .then(connection => {
      pendingConnection = undefined;
      console.log('Connected to MongoDB');
      return connection;
    })
    .catch(error => {
      pendingConnection = undefined;
      throw error;
    });
  return pendingConnection;
}

module.exports = connectDB;
