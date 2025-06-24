const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 4000;
const SECRET = 'supersecretkey'; // Change this in production

app.use(cors());
app.use(bodyParser.json());

// In-memory blog posts
let posts = [
  // Example post
  // { id: 1, title: 'Welcome', content: 'First post!', author: 'Admin', createdAt: new Date().toISOString() }
];
let nextId = 1;

// Simple admin user
const ADMIN = { username: 'admin', password: 'admin123' };
const ADMIN1 = { username: 'admin', password: 'admin123' };
const ADMIN2 = { username: 'admin', password: 'admin123' };
const ADMIN3  = { username: 'admin', password: 'admin123' };


// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN.username && password === ADMIN.password) {
    const token = jwt.sign({ username }, SECRET, { expiresIn: '2h' });
    return res.json({ token });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

// Get all posts
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// Get single post
app.get('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === Number(req.params.id));
  if (!post) return res.status(404).json({ message: 'Not found' });
  res.json(post);
});

// Create post (admin only)
app.post('/api/posts', authenticateToken, (req, res) => {
  const { title, content, author } = req.body;
  const post = { id: nextId++, title, content, author, createdAt: new Date().toISOString() };
  posts.unshift(post);
  res.status(201).json(post);
});

// Edit post (admin only)
app.put('/api/posts/:id', authenticateToken, (req, res) => {
  const post = posts.find(p => p.id === Number(req.params.id));
  if (!post) return res.status(404).json({ message: 'Not found' });
  post.title = req.body.title;
  post.content = req.body.content;
  post.author = req.body.author;
  res.json(post);
});

// Delete post (admin only)
app.delete('/api/posts/:id', authenticateToken, (req, res) => {
  const idx = posts.findIndex(p => p.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  posts.splice(idx, 1);
  res.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`Blog API running on http://localhost:${PORT}`);
}); 