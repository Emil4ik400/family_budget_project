const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

require('dotenv').config();
const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
    throw new Error('JWT_SECRET is not defined in .env file');
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'name is required' });
    }
    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'valid email is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'password must be at least 6 characters' });
    }

    try {
      const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
        [name, email, hashedPassword]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Server error during registration' });
    }
  });

  router.post('/login', async(req,res) => {
    const {email, password} = req.body;

    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'valid email is required' });
    }
    if (!password || password.length < 1) {
      return res.status(400).json({ error: 'password is required' });
    }

    try{
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];
        if(!user){
            return res.status(400).json({error: 'Invalid email or password'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ error: 'Invalid email or password' });
        }
    
        const token = jwt.sign({ user_id: user.id }, SECRET, { expiresIn: '7d' });
        res.json({ token });
      } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
      }
    });
    
    module.exports = router;
    