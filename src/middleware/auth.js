import jwt from 'jsonwebtoken';

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = req.cookies?.admin_jwt || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};