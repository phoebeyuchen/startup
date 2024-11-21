const express = require('express');
const fetch = require('node-fetch');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const db = require('./database');
const app = express();

// The service port
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Authorization middleware
const authMiddleware = async (req, res, next) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    res.status(401).send({ msg: 'Missing authorization token' });
    return;
  }

  const user = await db.getUserByToken(authToken);
  if (!user) {
    res.status(401).send({ msg: 'Invalid authorization token' });
    return;
  }

  req.user = user;
  next();
};

// CreateAuth a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send({ msg: 'Email and password required' });
    return;
  }

  try {
    const user = await db.getUser(req.body.email);
    if (user) {
      res.status(409).send({ msg: 'Existing user' });
    } else {
      const newUser = await db.createUser(req.body.email, req.body.password);
      res.send({ token: newUser.token });
    }
  } catch (error) {
    res.status(500).send({ msg: 'Database error during user creation' });
  }
});

// GetAuth login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  try {
    const user = await db.getUser(req.body.email);
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      res.send({ token: user.token });
      return;
    }
    res.status(401).send({ msg: 'Unauthorized' });
  } catch (error) {
    res.status(500).send({ msg: 'Database error during login' });
  }
});

// DeleteAuth logout a user
apiRouter.delete('/auth/logout', (_req, res) => {
  res.status(204).end();
});

// Question endpoints
apiRouter.get('/question', async (_req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let dailyQuestion = await db.getDailyQuestion(today);
    if (dailyQuestion) {
      return res.send({
        question: dailyQuestion.quote,
        starter: dailyQuestion.starter,
        date: dailyQuestion.date
      });
    }

    const response = await fetch('https://api.api-ninjas.com/v1/quotes?category=love', {
      headers: { 'X-Api-Key': 'fp78EFMI/VJ6NsEqVO+JwA==ALxoasBJu4wh1Hmu' }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch question');
    }

    const questions = await response.json();
    const starters = [
      "What do you think about this quote: ",
      "How does this make you feel: ",
      "How can we apply this to our relationship: ",
      "Share a memory that relates to this: ",
      "What does this quote mean to you: "
    ];
    
    const newQuestion = {
      quote: questions[0]?.quote,
      starter: starters[Math.floor(Math.random() * starters.length)],
      date: today
    };
    
    await db.createQuestion(newQuestion);
    res.send({
      question: newQuestion.quote,
      starter: newQuestion.starter,
      date: newQuestion.date.toISOString()
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch question' });
  }
});

// Answer endpoints
apiRouter.get('/answers', authMiddleware, async (req, res) => {
  try {
    const answers = await db.getAnswers(req.user.email);
    res.send(answers);
  } catch (error) {
    res.status(500).send({ msg: 'Failed to get answers' });
  }
});

apiRouter.post('/answer', authMiddleware, async (req, res) => {
  try {
    const newAnswer = {
      id: uuid.v4(),
      userEmail: req.user.email,
      question: req.body.question,
      answer: req.body.answer,
      date: new Date().toISOString()
    };
    
    await db.createAnswer(newAnswer);
    res.send(newAnswer);
  } catch (error) {
    res.status(500).send({ msg: 'Failed to save answer' });
  }
});

apiRouter.put('/answer/:id', authMiddleware, async (req, res) => {
  try {
    const answer = await db.getAnswerById(req.params.id);
    if (!answer) {
      res.status(404).send({ msg: 'Answer not found' });
      return;
    }

    if (answer.userEmail !== req.user.email) {
      res.status(403).send({ msg: 'Not authorized to edit this answer' });
      return;
    }

    const answerDate = new Date(answer.date);
    const today = new Date();
    if (answerDate.getDate() !== today.getDate() ||
        answerDate.getMonth() !== today.getMonth() ||
        answerDate.getFullYear() !== today.getFullYear()) {
      res.status(400).send({ msg: 'Can only edit answers from today' });
      return;
    }

    await db.updateAnswer(req.params.id, req.body.answer);
    res.send({
      ...answer,
      answer: req.body.answer,
      date: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).send({ msg: 'Failed to update answer' });
  }
});

// Chat endpoints
apiRouter.get('/messages', authMiddleware, async (req, res) => {
  try {
    const messages = await db.getMessages();
    res.send(messages);
  } catch (error) {
    res.status(500).send({ msg: 'Failed to get messages' });
  }
});

apiRouter.post('/message', authMiddleware, async (req, res) => {
  try {
    const newMessage = {
      id: uuid.v4(),
      userEmail: req.user.email,
      text: req.body.text,
      timestamp: new Date().toISOString()
    };
    
    await db.createMessage(newMessage);
    res.send(newMessage);
  } catch (error) {
    res.status(500).send({ msg: 'Failed to save message' });
  }
});

// Default path handler
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Start server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});