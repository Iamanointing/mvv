const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { getDatabase } = require('../database/init');

const router = express.Router();
const db = getDatabase();

// Get real-time results (public but can be restricted)
router.get('/realtime', async (req, res) => {
  try {
    const positions = await db.prepare('SELECT * FROM positions ORDER BY created_at ASC').all();
    const results = [];
    
    for (const position of positions) {
      const contestants = await db.prepare(`
        SELECT * FROM contestants 
        WHERE position_id = ? AND verified = 1
      `).all(position.id);
      
      const contestantCount = contestants.length;
      
      const positionResults = await Promise.all(contestants.map(async (contestant) => {
        // Count votes for this contestant
        const validVotes = await db.prepare(`
          SELECT COUNT(*) as count 
          FROM votes 
          WHERE position_id = ? AND contestant_id = ? AND is_cancelled = 0
        `).get(position.id, contestant.id);
        
        const cancelledVotes = await db.prepare(`
          SELECT COUNT(*) as count 
          FROM votes 
          WHERE position_id = ? AND contestant_id = ? AND is_cancelled = 1
        `).get(position.id, contestant.id);
        
        // For single candidate positions, count yes/no votes
        const yesVotes = await db.prepare(`
          SELECT COUNT(*) as count 
          FROM votes 
          WHERE position_id = ? AND contestant_id = ? AND choice = 'yes' AND is_cancelled = 0
        `).get(position.id, contestant.id);
        
        const noVotes = await db.prepare(`
          SELECT COUNT(*) as count 
          FROM votes 
          WHERE position_id = ? AND contestant_id = ? AND choice = 'no' AND is_cancelled = 0
        `).get(position.id, contestant.id);
        
        const totalValidVotes = await db.prepare(`
          SELECT COUNT(*) as count 
          FROM votes 
          WHERE position_id = ? AND is_cancelled = 0
        `).get(position.id);
        
        // Calculate vote count based on position type
        let voteCount = 0;
        if (contestantCount > 1) {
          // Multiple candidates - count all votes for this contestant
          voteCount = validVotes.count;
        } else {
          // Single candidate - count only yes votes
          voteCount = yesVotes.count;
        }
        
        const percentage = totalValidVotes.count > 0 
          ? ((voteCount / totalValidVotes.count) * 100).toFixed(2) 
          : 0;
        
        return {
          ...contestant,
          votes: voteCount,
          percentage: parseFloat(percentage),
          cancelled_votes: cancelledVotes.count,
          yes_votes: yesVotes.count,
          no_votes: noVotes.count
        };
      }));
      
      // Find winner
      const winner = positionResults.length > 0 
        ? positionResults.reduce((max, c) => c.votes > max.votes ? c : max)
        : null;
      
      const totalValid = await db.prepare(`
        SELECT COUNT(*) as count 
        FROM votes 
        WHERE position_id = ? AND is_cancelled = 0
      `).get(position.id);
      
      const totalCancelled = await db.prepare(`
        SELECT COUNT(*) as count 
        FROM votes 
        WHERE position_id = ? AND is_cancelled = 1
      `).get(position.id);
      
      results.push({
        position,
        contestants: positionResults,
        winner,
        total_valid_votes: totalValid.count,
        total_cancelled_votes: totalCancelled.count
      });
    }
    
    res.json(results);
  } catch (error) {
    console.error('Results error:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// Get detailed results with vote submissions (admin only)
router.get('/detailed', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const votes = await db.prepare(`
      SELECT v.*, u.full_name as voter_name, u.reg_number as voter_reg,
             p.name as position_name, c.name as contestant_name
      FROM votes v
      JOIN users u ON v.user_id = u.id
      JOIN positions p ON v.position_id = p.id
      LEFT JOIN contestants c ON v.contestant_id = c.id
      ORDER BY v.created_at ASC
    `).all();
    
    res.json(votes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch detailed results' });
  }
});

module.exports = router;
