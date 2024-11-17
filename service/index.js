const express = require('express');
const fetch = require('node-fetch');
const uuid = require('uuid');
const app = express();

// The scores and users are saved in memory and disappear whenever the service is restarted.
let users = {};
let answers = [];
let messages = [];

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth a new user
apiRouter.post('/auth/create', async (req, res) => {
  const user = users[req.body.email];
  if (user) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = { email: req.body.email, password: req.body.password, token: uuid.v4() };
    users[user.email] = user;
    res.send({ token: user.token });
  }
});

// GetAuth login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  const user = users[req.body.email];
  if (user && req.body.password === user.password) {
    user.token = uuid.v4();
    res.send({ token: user.token });
    return;
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth logout a user
apiRouter.delete('/auth/logout', (req, res) => {
  const user = Object.values(users).find((u) => u.token === req.body.token);
  if (user) {
    delete user.token;
  }
  res.status(204).end();
});

// Question endpoints
apiRouter.get('/question', async (_req, res) => {
  try {
    const response = await fetch('https://api.api-ninjas.com/v1/quotes?category=love', {
      headers: {
        'X-Api-Key': 'fp78EFMI/VJ6NsEqVO+JwA==ALxoasBJu4wh1Hmu' 
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch question');
    }

    const questions = await response.json();
    const question = questions[0]?.quote;
    
    res.send({
      question: question,
      date: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).send({ error: 'Failed to fetch question from API' });
  }
});

// Answer endpoints
apiRouter.get('/answers', (req, res) => {
  const userToken = req.headers.authorization;
  const user = Object.values(users).find((u) => u.token === userToken);
  
  if (!user) {
    res.status(401).send({ msg: 'Unauthorized' });
    return;
  }
  
  const userAnswers = answers.filter(a => a.userEmail === user.email);
  res.send(userAnswers);
});

apiRouter.post('/answer', (req, res) => {
  const userToken = req.headers.authorization;
  const user = Object.values(users).find((u) => u.token === userToken);
  
  if (!user) {
    res.status(401).send({ msg: 'Unauthorized' });
    return;
  }

  const newAnswer = {
    id: uuid.v4(),
    userEmail: user.email,
    question: req.body.question,
    answer: req.body.answer,
    date: new Date().toISOString()
  };
  
  answers.push(newAnswer);
  res.send(newAnswer);
});

// Chat endpoints
apiRouter.get('/messages', (req, res) => {
  const userToken = req.headers.authorization;
  const user = Object.values(users).find((u) => u.token === userToken);
  
  if (!user) {
    res.status(401).send({ msg: 'Unauthorized' });
    return;
  }
  
  res.send(messages);
});

apiRouter.post('/message', (req, res) => {
  const userToken = req.headers.authorization;
  const user = Object.values(users).find((u) => u.token === userToken);
  
  if (!user) {
    res.status(401).send({ msg: 'Unauthorized' });
    return;
  }

  const newMessage = {
    id: uuid.v4(),
    userEmail: user.email,
    text: req.body.text,
    timestamp: new Date().toISOString()
  };
  
  messages.push(newMessage);
  res.send(newMessage);
});


// Default path handler
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});