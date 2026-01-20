const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken, requireUser } = require('../middleware/auth');
const { getDatabase } = require('../database/init');

const router = express.Router();
const db = getDatabase();

// Configure multer for profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'profiles');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.use(authenticateToken);
router.use(requireUser);

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await db.prepare('SELECT id, reg_number, full_name, level, department, email, profile_picture, has_voted FROM users WHERE id = ?').get(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update profile picture
router.post('/profile/picture', upload.single('profile_picture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const photoPath = `/uploads/profiles/${req.file.filename}`;
    const update = db.prepare('UPDATE users SET profile_picture = ? WHERE id = ?');
    await update.run(photoPath, req.user.id);
    
    res.json({ profile_picture: photoPath });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile picture' });
  }
});

// Report a problem
router.post('/report', (req, res) => {
  try {
    const { subject, message } = req.body;
    // In a real application, you'd save this to a reports table
    // For now, we'll just log it
    console.log('Problem reported:', { user_id: req.user.id, subject, message });
    res.json({ message: 'Problem reported successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

module.exports = router;

