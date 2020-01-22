import express from 'express';
import verify from '../utils/verifyToken';
import Post from '../models/Post';
const router = express.Router();

// Get all posts by user
router.get('/posts', verify, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user });
    res.json(posts);
  } catch (error) {
    res.status(500).send('Database error');
  }
});

// Create Post
router.post('/posts', verify, async (req, res) => {
  const post = new Post({
    title: req.body.title,
    body: req.body.body,
    author: req.user,
  });
  try {
    const result = await post.save();
    res.json(result);
  } catch (error) {
    res.status(500).send('Database error');
  }
});

export default router;
