import jwt from 'jsonwebtoken';

export default function(req, res, next) {
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.split(' ')[0] === 'Bearer'
      ? authHeader.split(' ')[1]
      : null;
  if (!token) return res.status(401).send('Missing token. Access denied');

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send(error.message);
  }
}
