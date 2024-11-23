const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
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
function getAnswers(userEmail) {
  return answerCollection.find({ userEmail: userEmail }).sort({ date: -1 }).toArray();
}

function getAnswerById(id) {
  return answerCollection.findOne({ id: id });
}

function createAnswer(answer) {
  return answerCollection.insertOne(answer);
}

function updateAnswer(id, newAnswer) {
  return answerCollection.updateOne(
    { id: id },
    { $set: { answer: newAnswer, updated: new Date() }}
  );
}

// Message functions
function getMessages() {
  return messageCollection.find().sort({ timestamp: -1 }).limit(100).toArray();
}

function createMessage(message) {
  return messageCollection.insertOne(message);
}

// Question functions
function getDailyQuestion(date) {
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

function createQuestion(question) {
  return questionCollection.insertOne(question);
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