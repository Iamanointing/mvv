const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'myvesavote.db');
const db = new sqlite3.Database(dbPath);

console.log('=== MyVesaVote Database Viewer ===\n');

// List all tables
db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  
  console.log('Available Tables:');
  tables.forEach(table => {
    console.log(`  - ${table.name}`);
  });
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Query each table
  const tablesToShow = ['students', 'users', 'admins', 'positions', 'contestants', 'votes', 'announcements', 'settings'];
  
  tablesToShow.forEach(tableName => {
    db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
      if (err) {
        // Table might not exist or empty
        return;
      }
      
      console.log(`\n📊 Table: ${tableName}`);
      console.log(`   Rows: ${rows.length}`);
      if (rows.length > 0) {
        console.log('   Sample data:');
        console.log(JSON.stringify(rows.slice(0, 3), null, 2));
      }
      console.log('-'.repeat(50));
    });
  });
  
  // Close after a delay
  setTimeout(() => {
    db.close();
    console.log('\n✅ Database closed');
  }, 2000);
});

