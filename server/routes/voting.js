const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken, requireUser } = require('../middleware/auth');
const { getDatabase } = require('../database/init');

const router = express.Router();
const db = getDatabase();

// Configure multer for vote photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'votes');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'vote-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.use(authenticateToken);
router.use(requireUser);

// Get all positions with contestants
router.get('/positions', async (req, res) => {
  try {
    const votingStatus = await db.prepare('SELECT value FROM settings WHERE key = ?').get('voting_open');
    const votingEnded = await db.prepare('SELECT value FROM settings WHERE key = ?').get('voting_ended');
    
    const positions = await db.prepare(`
      SELECT p.*, 
             (SELECT COUNT(*) FROM contestants WHERE position_id = p.id AND verified = 1) as contestant_count
      FROM positions p
      ORDER BY p.created_at ASC
    `).all();
    
    for (const position of positions) {
      const contestants = await db.prepare(`
        SELECT * FROM contestants 
        WHERE position_id = ? AND verified = 1
        ORDER BY name ASC
      `).all(position.id);
      position.contestants = contestants;
    }
    
    res.json({
      positions,
      voting_open: votingStatus.value === '1',
      voting_ended: votingEnded.value === '1'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch positions' });
  }
});

// Check if user has voted
router.get('/status', async (req, res) => {
  try {
    const user = await db.prepare('SELECT has_voted FROM users WHERE id = ?').get(req.user.id);
    res.json({ has_voted: user.has_voted === 1 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check voting status' });
  }
});

// Submit vote
router.post('/submit', upload.single('photo'), async (req, res) => {
  try {
    // Check if voting is open
    const votingStatus = await db.prepare('SELECT value FROM settings WHERE key = ?').get('voting_open');
    if (votingStatus.value !== '1') {
      return res.status(403).json({ error: 'Voting is currently closed' });
    }
    
    // Check if user has already voted
    const user = await db.prepare('SELECT has_voted FROM users WHERE id = ?').get(req.user.id);
    if (user.has_voted === 1) {
      return res.status(403).json({ error: 'You have already voted' });
    }
    
    // Photo is required
    if (!req.file) {
      return res.status(400).json({ error: 'Photo is required to submit vote' });
    }
    
    const { votes } = req.body; // Array of {position_id, contestant_id, choice}
    const photoPath = `/uploads/votes/${req.file.filename}`;
    
    const insertVote = db.prepare(`
      INSERT INTO votes (user_id, position_id, contestant_id, choice, photo)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const votesArray = JSON.parse(votes);
    for (const vote of votesArray) {
      await insertVote.run(
        req.user.id,
        vote.position_id,
        vote.contestant_id || null,
        vote.choice,
        photoPath
      );
    }
    
    // Mark user as voted
    const updateUser = db.prepare('UPDATE users SET has_voted = 1 WHERE id = ?');
    await updateUser.run(req.user.id);
    
    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('vote-submitted', { user_id: req.user.id });
    }
    
    res.json({ message: 'Vote submitted successfully' });
  } catch (error) {
    console.error('Vote submission error:', error);
    res.status(500).json({ error: 'Failed to submit vote' });
  }
});

module.exports = router;
