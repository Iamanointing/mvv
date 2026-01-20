const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { getDatabase } = require('../database/init');

const router = express.Router();
const db = getDatabase();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.use(authenticateToken);
router.use(requireAdmin);

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await db.prepare('SELECT id, reg_number, full_name, level, department, email, has_voted, created_at FROM users ORDER BY created_at DESC').all();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get all students
router.get('/students', async (req, res) => {
  try {
    const students = await db.prepare('SELECT * FROM students ORDER BY created_at DESC').all();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Add student to database
router.post('/students', async (req, res) => {
  try {
    const { reg_number, full_name, level, department, email } = req.body;
    
    const insertStudent = db.prepare(`
      INSERT INTO students (reg_number, full_name, level, department, email)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    await insertStudent.run(reg_number, full_name, level, department, email || null);
    res.status(201).json({ message: 'Student added successfully' });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Student with this registration number already exists' });
    }
    res.status(500).json({ error: 'Failed to add student' });
  }
});

// Bulk upload students (CSV format)
router.post('/students/bulk', async (req, res) => {
  try {
    const { students } = req.body; // Array of {reg_number, full_name, level, department, email}
    
    const insertStudent = db.prepare(`
      INSERT OR IGNORE INTO students (reg_number, full_name, level, department, email)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    for (const student of students) {
      await insertStudent.run(
        student.reg_number,
        student.full_name,
        student.level,
        student.department,
        student.email || null
      );
    }
    
    res.json({ message: 'Students uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload students' });
  }
});

// Get all positions
router.get('/positions', async (req, res) => {
  try {
    const positions = await db.prepare('SELECT * FROM positions ORDER BY created_at DESC').all();
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch positions' });
  }
});

// Create position
router.post('/positions', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const insertPosition = db.prepare('INSERT INTO positions (name, description) VALUES (?, ?)');
    await insertPosition.run(name, description || null);
    res.status(201).json({ message: 'Position created successfully' });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Position already exists' });
    }
    res.status(500).json({ error: 'Failed to create position' });
  }
});

// Get all contestants
router.get('/contestants', async (req, res) => {
  try {
    const contestants = await db.prepare(`
      SELECT c.*, p.name as position_name
      FROM contestants c
      JOIN positions p ON c.position_id = p.id
      ORDER BY c.created_at DESC
    `).all();
    res.json(contestants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contestants' });
  }
});

// Add contestant
router.post('/contestants', upload.single('photo'), async (req, res) => {
  try {
    const { position_id, name, reg_number, level, department, bio } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : null;
    
    const insertContestant = db.prepare(`
      INSERT INTO contestants (position_id, name, reg_number, level, department, photo, bio)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    await insertContestant.run(position_id, name, reg_number || null, level || null, department || null, photo, bio || null);
    res.status(201).json({ message: 'Contestant added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add contestant' });
  }
});

// Verify contestant
router.put('/contestants/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;
    const update = db.prepare('UPDATE contestants SET verified = 1 WHERE id = ?');
    await update.run(id);
    res.json({ message: 'Contestant verified' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify contestant' });
  }
});

// Get all votes with user info
router.get('/votes', async (req, res) => {
  try {
    const votes = await db.prepare(`
      SELECT v.*, u.full_name as voter_name, u.reg_number as voter_reg,
             p.name as position_name, c.name as contestant_name
      FROM votes v
      JOIN users u ON v.user_id = u.id
      JOIN positions p ON v.position_id = p.id
      LEFT JOIN contestants c ON v.contestant_id = c.id
      ORDER BY v.created_at DESC
    `).all();
    res.json(votes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch votes' });
  }
});

// Cancel a vote
router.put('/votes/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;
    
    const update = db.prepare(`
      UPDATE votes 
      SET is_cancelled = 1, cancelled_by = ?, cancelled_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    await update.run(adminId, id);
    res.json({ message: 'Vote cancelled' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel vote' });
  }
});

// Get system settings
router.get('/settings', async (req, res) => {
  try {
    const settings = await db.prepare('SELECT * FROM settings').all();
    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value;
    });
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update system settings
router.put('/settings', async (req, res) => {
  try {
    const { key, value } = req.body;
    
    const update = db.prepare(`
      UPDATE settings 
      SET value = ?, updated_at = CURRENT_TIMESTAMP
      WHERE key = ?
    `);
    await update.run(value, key);
    
    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('settings-update', { key, value });
    }
    
    res.json({ message: 'Setting updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

// Toggle registration
router.post('/settings/toggle-registration', async (req, res) => {
  try {
    const current = await db.prepare('SELECT value FROM settings WHERE key = ?').get('registration_open');
    const newValue = current.value === '1' ? '0' : '1';
    
    const update = db.prepare('UPDATE settings SET value = ? WHERE key = ?');
    await update.run(newValue, 'registration_open');
    
    const io = req.app.get('io');
    if (io) {
      io.emit('settings-update', { key: 'registration_open', value: newValue });
    }
    
    res.json({ registration_open: newValue === '1' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle registration' });
  }
});

// Toggle voting
router.post('/settings/toggle-voting', async (req, res) => {
  try {
    const current = await db.prepare('SELECT value FROM settings WHERE key = ?').get('voting_open');
    const newValue = current.value === '1' ? '0' : '1';
    
    const update = db.prepare('UPDATE settings SET value = ? WHERE key = ?');
    await update.run(newValue, 'voting_open');
    
    const io = req.app.get('io');
    if (io) {
      io.emit('settings-update', { key: 'voting_open', value: newValue });
    }
    
    res.json({ voting_open: newValue === '1' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle voting' });
  }
});

// End voting
router.post('/settings/end-voting', async (req, res) => {
  try {
    const update = db.prepare(`
      UPDATE settings 
      SET value = ? 
      WHERE key = ?
    `);
    await update.run('0', 'voting_open');
    await update.run('1', 'voting_ended');
    
    const io = req.app.get('io');
    if (io) {
      io.emit('settings-update', { key: 'voting_ended', value: '1' });
      io.emit('settings-update', { key: 'voting_open', value: '0' });
    }
    
    res.json({ message: 'Voting ended' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to end voting' });
  }
});

// Get voter logs (names as they vote)
router.get('/logs/voters', async (req, res) => {
  try {
    const logs = await db.prepare(`
      SELECT u.full_name, u.reg_number, v.created_at as voted_at
      FROM votes v
      JOIN users u ON v.user_id = u.id
      WHERE v.is_cancelled = 0
      ORDER BY v.created_at DESC
    `).all();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch voter logs' });
  }
});

module.exports = router;
