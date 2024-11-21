const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');
const uuid = require('uuid');
const db = require('./database');
const app = express();

// Constants
const port = process.argv.length > 2 ? process.argv[2] : 4000;
const authCookieName = 'token';

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.set('trust proxy', true);

// Router for service endpoints
const apiRouter = express.Router();
app.use('/api', apiRouter);

// CreateAuth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send({ msg: 'Email and password required' });
    return;
  }

  try {
    if (await db.getUser(req.body.email)) {
      res.status(409).send({ msg: 'Existing user' });
    } else {
      const user = await db.createUser(req.body.email, req.body.password);
      setAuthCookie(res, user.token);
      res.send({ id: user._id });
    }
  } catch (error) {
    res.status(500).send({ msg: 'Database error during user creation' });
  }
});

// GetAuth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
  try {
    const user = await db.getUser(req.body.email);
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      res.send({ id: user._id });
      return;
    }
    res.status(401).send({ msg: 'Unauthorized' });
  } catch (error) {
    res.status(500).send({ msg: 'Database error during login' });
  }
});

// DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Secure router with authentication
const secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  const authToken = req.cookies[authCookieName];
  const user = await db.getUserByToken(authToken);
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// Question endpoints
secureApiRouter.get('/question', async (_req, res) => {
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
secureApiRouter.get('/answers', async (req, res) => {
  try {
    const answers = await db.getAnswers(req.user.email);
    res.send(answers);
  } catch (error) {
    res.status(500).send({ msg: 'Failed to get answers' });
  }
});

secureApiRouter.post('/answer', async (req, res) => {
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

secureApiRouter.put('/answer/:id', async (req, res) => {
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
secureApiRouter.get('/messages', async (_req, res) => {
  try {
    const messages = await db.getMessages();
    res.send(messages);
  } catch (error) {
    res.status(500).send({ msg: 'Failed to get messages' });
  }
});

secureApiRouter.post('/message', async (req, res) => {
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

// Error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Default path handler
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Cookie helper
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});