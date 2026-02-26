const mongoose = require("mongoose");

let dbReady = false;
let dbError = null;

async function initMongo(uri) {
  if (!uri) {
    dbReady = false;
    dbError = "Missing MONGODB_URI in .env";
    console.error("Error: " + dbError);
    return;
  }

  try {
    await mongoose.connect(uri);
    dbReady = true;
    dbError = null;
    console.log("MongoDB connected");
  } catch (err) {
    dbReady = false;
    dbError = err.message;
    console.error("MongoDB connection failed:", err.message);
  }
}

function isDbReady() {
  return dbReady;
}

function getDbError() {
  return dbError;
}

module.exports = { initMongo, isDbReady, getDbError };
