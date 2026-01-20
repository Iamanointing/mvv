const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDatabase } = require('../database/init');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();
const db = getDatabase();

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { reg_number, password, full_name, level, department, email } = req.body;

    // Check if registration is open
    const registrationStatus = await db.prepare('SELECT value FROM settings WHERE key = ?').get('registration_open');
    if (registrationStatus.value !== '1') {
      return res.status(403).json({ error: 'Registration is currently closed' });
    }

    // Validate student exists in database
    const student = await db.prepare('SELECT * FROM students WHERE reg_number = ? AND full_name = ?').get(reg_number, full_name);
    if (!student) {
      return res.status(400).json({ error: 'Registration number and name do not match our records' });
    }

    // Check if user already exists
    const existingUser = await db.prepare('SELECT * FROM users WHERE reg_number = ?').get(reg_number);
    if (existingUser) {
      return res.status(400).json({ error: 'User already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const insertUser = db.prepare(`
      INSERT INTO users (reg_number, password, full_name, level, department, email)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    await insertUser.run(reg_number, hashedPassword, full_name, level, department, email);

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { reg_number, password } = req.body;

    const user = await db.prepare('SELECT * FROM users WHERE reg_number = ?').get(reg_number);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, reg_number: user.reg_number, role: 'user' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        reg_number: user.reg_number,
        full_name: user.full_name,
        level: user.level,
        department: user.department,
        email: user.email,
        profile_picture: user.profile_picture,
        has_voted: user.has_voted
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
