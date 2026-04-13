import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (user && await user.validPassword(password)) {
      const token = jwt.sign(
        { id: user.id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
      );
      res.cookie('admin_jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000,
      });
      return res.json({ message: "Login Successful", token, role: user.role });
    }
    res.status(401).json({ message: "Invalid credentials" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;