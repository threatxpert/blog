import express from 'express';
import cors from 'cors';
import { Sequelize, DataTypes } from 'sequelize';

// MySQL connection (edit credentials as needed)
const sequelize = new Sequelize('threatexpert', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql',
});

// BlogPost model
const BlogPost = sequelize.define('BlogPost', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

const app = express();
app.use(cors());
app.use(express.json());

// Sync DB
sequelize.sync();

// Routes
app.get('/api/posts', async (req, res) => {
  const posts = await BlogPost.findAll({ order: [['createdAt', 'DESC']] });
  res.json(posts);
});

app.get('/api/posts/:id', async (req, res) => {
  const post = await BlogPost.findByPk(req.params.id);
  if (!post) return res.status(404).json({ error: 'Not found' });
  res.json(post);
});

app.post('/api/posts', async (req, res) => {
  const { title, content, author } = req.body;
  const post = await BlogPost.create({ title, content, author });
  res.status(201).json(post);
});

app.put('/api/posts/:id', async (req, res) => {
  const { title, content, author } = req.body;
  const post = await BlogPost.findByPk(req.params.id);
  if (!post) return res.status(404).json({ error: 'Not found' });
  await post.update({ title, content, author });
  res.json(post);
});

app.delete('/api/posts/:id', async (req, res) => {
  const post = await BlogPost.findByPk(req.params.id);
  if (!post) return res.status(404).json({ error: 'Not found' });
  await post.destroy();
  res.json({ success: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Blog backend running on port ${PORT}`);
}); 