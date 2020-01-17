import express from 'express';
import verify from '../utils/verifyToken';
const router = express.Router();

export const postsRoute = router.get('/posts', verify, async (req, res) => {
  // Validate user
  res.send(req.user);
});
