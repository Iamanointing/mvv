const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const dbPath = path.join(__dirname, 'myvesavote.db');
let db = null;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function initDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }

      // Enable foreign keys
      db.run('PRAGMA foreign_keys = ON');

      // Students table (pre-populated by admin)
      db.run(`
        CREATE TABLE IF NOT EXISTS students (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          reg_number TEXT UNIQUE NOT NULL,
          full_name TEXT NOT NULL,
          level TEXT NOT NULL,
          department TEXT NOT NULL,
          email TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) console.error('Error creating students table:', err);
      });

      // Users table (voters)
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          reg_number TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          full_name TEXT NOT NULL,
          level TEXT NOT NULL,
          department TEXT NOT NULL,
          email TEXT NOT NULL,
          profile_picture TEXT,
          has_voted INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (reg_number) REFERENCES students(reg_number)
        )
      `, (err) => {
        if (err) console.error('Error creating users table:', err);
      });

      // Admin table
      db.run(`
        CREATE TABLE IF NOT EXISTS admins (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) console.error('Error creating admins table:', err);
      });

      // Positions table
      db.run(`
        CREATE TABLE IF NOT EXISTS positions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) console.error('Error creating positions table:', err);
      });

      // Contestants table
      db.run(`
        CREATE TABLE IF NOT EXISTS contestants (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          position_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          reg_number TEXT,
          level TEXT,
          department TEXT,
          photo TEXT,
          bio TEXT,
          verified INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (position_id) REFERENCES positions(id)
        )
      `, (err) => {
        if (err) console.error('Error creating contestants table:', err);
      });

      // Votes table
      db.run(`
        CREATE TABLE IF NOT EXISTS votes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          position_id INTEGER NOT NULL,
          contestant_id INTEGER,
          choice TEXT NOT NULL,
          photo TEXT NOT NULL,
          is_cancelled INTEGER DEFAULT 0,
          cancelled_by INTEGER,
          cancelled_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (position_id) REFERENCES positions(id),
          FOREIGN KEY (contestant_id) REFERENCES contestants(id),
          FOREIGN KEY (cancelled_by) REFERENCES admins(id)
        )
      `, (err) => {
        if (err) console.error('Error creating votes table:', err);
      });

      // Announcements table
      db.run(`
        CREATE TABLE IF NOT EXISTS announcements (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          admin_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (admin_id) REFERENCES admins(id)
        )
      `, (err) => {
        if (err) console.error('Error creating announcements table:', err);
      });

      // System settings table
      db.run(`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating settings table:', err);
          reject(err);
          return;
        }

        // Initialize default settings
        db.get('SELECT COUNT(*) as count FROM settings', (err, row) => {
          if (err) {
            console.error('Error checking settings:', err);
            reject(err);
            return;
          }

          if (row.count === 0) {
            db.run(`
              INSERT INTO settings (key, value) VALUES 
              ('registration_open', '1'),
              ('voting_open', '0'),
              ('voting_ended', '0')
            `, (err) => {
              if (err) {
                console.error('Error inserting default settings:', err);
                reject(err);
                return;
              }

              // Create default admin account (password: admin123)
              db.get('SELECT COUNT(*) as count FROM admins', (err, adminRow) => {
                if (err) {
                  console.error('Error checking admins:', err);
                  reject(err);
                  return;
                }

                if (adminRow.count === 0) {
                  const bcrypt = require('bcryptjs');
                  const hashedPassword = bcrypt.hashSync('admin123', 10);
                  db.run('INSERT INTO admins (username, password) VALUES (?, ?)', 
                    ['admin', hashedPassword], 
                    (err) => {
                      if (err) {
                        console.error('Error creating admin:', err);
                        reject(err);
                        return;
                      }
                      console.log('Default admin created: username: admin, password: admin123');
                      console.log('Database initialized successfully');
                      resolve();
                    }
                  );
                } else {
                  console.log('Database initialized successfully');
                  resolve();
                }
              });
            });
          } else {
            console.log('Database initialized successfully');
            resolve();
          }
        });
      });
    });
  });
}

// Promisify database methods for easier use
function promisifyDb() {
  return {
    run: promisify(db.run.bind(db)),
    get: promisify(db.get.bind(db)),
    all: promisify(db.all.bind(db)),
    exec: promisify(db.exec.bind(db)),
    prepare: (sql) => {
      const stmt = db.prepare(sql);
      return {
        run: promisify(stmt.run.bind(stmt)),
        get: promisify(stmt.get.bind(stmt)),
        all: promisify(stmt.all.bind(stmt)),
        finalize: promisify(stmt.finalize.bind(stmt))
      };
    }
  };
}

function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return promisifyDb();
}

// Synchronous version for compatibility with existing code
function getDatabaseSync() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return {
    prepare: (sql) => {
      const stmt = db.prepare(sql);
      return {
        run: function(...args) {
          return new Promise((resolve, reject) => {
            stmt.run(...args, function(err) {
              if (err) reject(err);
              else resolve({ lastID: this.lastID, changes: this.changes });
            });
          });
        },
        get: function(...args) {
          return new Promise((resolve, reject) => {
            stmt.get(...args, (err, row) => {
              if (err) reject(err);
              else resolve(row);
            });
          });
        },
        all: function(...args) {
          return new Promise((resolve, reject) => {
            stmt.all(...args, (err, rows) => {
              if (err) reject(err);
              else resolve(rows);
            });
          });
        },
        finalize: function() {
          return new Promise((resolve, reject) => {
            stmt.finalize((err) => {
              if (err) reject(err);
              else resolve();
            });
          });
        }
      };
    },
    exec: (sql) => {
      return new Promise((resolve, reject) => {
        db.exec(sql, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  };
}

module.exports = { initDatabase, getDatabase: getDatabaseSync };
