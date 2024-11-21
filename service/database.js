const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('rental');

const userCollection = db.collection('user');
const answerCollection = db.collection('answer');
const messageCollection = db.collection('message');
const questionCollection = db.collection('question');

(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});

// User functions
function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function createUser(email, password) {
  // Hash the password before storing
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
    created: new Date()
  };
  await userCollection.insertOne(user);
  return user;
}

// Answer functions
async function getAnswers(userEmail) {
  const query = { userEmail: userEmail };
  const options = {
    sort: { date: -1 }
  };
  const cursor = answerCollection.find(query, options);
  return cursor.toArray();
}

async function getAnswerById(id) {
  return answerCollection.findOne({ id: id });
}

async function createAnswer(answer) {
  return answerCollection.insertOne({
    ...answer,
    created: new Date()
  });
}

async function updateAnswer(id, newAnswer) {
  const query = { id: id };
  const update = { $set: { 
    answer: newAnswer,
    updated: new Date()
  }};
  return answerCollection.updateOne(query, update);
}

// Message functions
async function getMessages() {
  const options = {
    sort: { timestamp: -1 },
    limit: 100 // Limit to last 100 messages
  };
  const cursor = messageCollection.find({}, options);
  return cursor.toArray();
}

async function createMessage(message) {
  return messageCollection.insertOne({
    ...message,
    created: new Date()
  });
}

// Question functions
async function getDailyQuestion(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return questionCollection.findOne({
    date: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  });
}

async function createQuestion(question) {
  return questionCollection.insertOne({
    ...question,
    created: new Date()
  });
}

module.exports = {
  getUser,
  getUserByToken,
  createUser,
  getAnswers,
  getAnswerById,
  createAnswer,
  updateAnswer,
  getMessages,
  createMessage,
  getDailyQuestion,
  createQuestion,
};