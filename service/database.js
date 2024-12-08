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
const partnerCollection = db.collection('partner');

// Connection test
(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});

// User functions
async function getUser(email) {
  return await userCollection.findOne({ email: email });
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
    created: new Date(),
    partnerId: null
  };
  await userCollection.insertOne(user);
  return user;
}

// Partner functions
async function connectPartners(userEmail, partnerEmail) {
  // Validate emails are different
  if (userEmail === partnerEmail) {
    throw new Error('Cannot connect with your own email');
  }

  const user = await getUser(userEmail);
  const partner = await getUser(partnerEmail);

  if (!user || !partner) {
    throw new Error('User or partner not found');
  }

  // Check if either user already has a partner
  const userPartnershipCheck = await partnerCollection.findOne({
    $or: [
      { user1Email: userEmail },
      { user2Email: userEmail }
    ]
  });

  const partnerPartnershipCheck = await partnerCollection.findOne({
    $or: [
      { user1Email: partnerEmail },
      { user2Email: partnerEmail }
    ]
  });

  if (userPartnershipCheck || partnerPartnershipCheck) {
    throw new Error('One or both users already have partners');
  }

  // Create the new partnership
  const partnership = {
    user1Email: userEmail,
    user2Email: partnerEmail,
    connected: new Date()
  };

  const result = await partnerCollection.insertOne(partnership);
  
  // Update both users with the partnership ID (not their own IDs)
  await userCollection.updateOne(
    { email: userEmail },
    { $set: { partnerId: result.insertedId } }
  );
  await userCollection.updateOne(
    { email: partnerEmail },
    { $set: { partnerId: result.insertedId } }
  );

  return partnership;
}

async function getPartner(userEmail) {
  const partnership = await partnerCollection.findOne({
    $or: [
      { user1Email: userEmail },
      { user2Email: userEmail }
    ]
  });
  
  if (!partnership) return null;
  
  const partnerEmail = partnership.user1Email === userEmail ? 
    partnership.user2Email : partnership.user1Email;
  
  return await getUser(partnerEmail);
}

// Answer functions
async function getAnswers(userEmail) {
  const partnership = await partnerCollection.findOne({
    $or: [
      { user1Email: userEmail },
      { user2Email: userEmail }
    ]
  });

  if (!partnership) {
    return await answerCollection.find({ userEmail: userEmail }).sort({ date: -1 }).toArray();
  }

  // Get answers from both partners
  return await answerCollection.find({
    userEmail: {
      $in: [partnership.user1Email, partnership.user2Email]
    }
  }).sort({ date: -1 }).toArray();
}

function getAnswerById(id) {
  return answerCollection.findOne({ id: id });
}

async function createAnswer(answer) {
  return answerCollection.insertOne(answer);
}

async function updateAnswer(id, newAnswer) {
  return answerCollection.updateOne(
    { id: id },
    { $set: { answer: newAnswer, updated: new Date() }}
  );
}

// Message functions
async function getMessages(userEmail) {
  const partnership = await partnerCollection.findOne({
    $or: [
      { user1Email: userEmail },
      { user2Email: userEmail }
    ]
  });

  if (!partnership) return [];

  return await messageCollection.find({
    userEmail: {
      $in: [partnership.user1Email, partnership.user2Email]
    }
  }).sort({ timestamp: -1 }).limit(100).toArray();
}

async function createMessage(message) {
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
  connectPartners,
  getPartner,
  getAnswers,
  getAnswerById,
  createAnswer,
  updateAnswer,
  getMessages,
  createMessage,
  getDailyQuestion,
  createQuestion,
};