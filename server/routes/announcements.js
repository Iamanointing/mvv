const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { getDatabase } = require('../database/init');

const router = express.Router();
const db = getDatabase();

// Get all announcements (public)
router.get('/', async (req, res) => {
  try {
    const announcements = await db.prepare(`
      SELECT a.*, ad.username as admin_username
      FROM announcements a
      JOIN admins ad ON a.admin_id = ad.id
      ORDER BY a.created_at DESC
      LIMIT 10
    `).all();
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// Create announcement (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, content } = req.body;
    const adminId = req.user.id;
    
    const insert = db.prepare(`
      INSERT INTO announcements (admin_id, title, content)
      VALUES (?, ?, ?)
    `);
    
    await insert.run(adminId, title, content);
    
    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('new-announcement', { title, content });
    }
    
    res.status(201).json({ message: 'Announcement created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

module.exports = router;

