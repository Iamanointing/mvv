// Helper to make sqlite3 work more like better-sqlite3
const { getDatabase } = require('./init');

function createAsyncDb() {
  const db = getDatabase();
  
  return {
    prepare: (sql) => {
      const stmt = db.prepare(sql);
      return {
        run: async (...args) => {
          const result = await stmt.run(...args);
          return { lastID: result.lastID, changes: result.changes };
        },
        get: async (...args) => {
          return await stmt.get(...args);
        },
        all: async (...args) => {
          return await stmt.all(...args);
        },
        finalize: async () => {
          return await stmt.finalize();
        }
      };
    },
    exec: async (sql) => {
      return await db.exec(sql);
    }
  };
}

module.exports = { createAsyncDb };

