# How to Access the Database

## Database Location
```
C:\Users\CBT_CTR1_108\Documents\mvv\server\database\myvesavote.db
```

---

## Method 1: View Database via Node.js Script (Quick & Easy)

I've created a script to view the database contents:

```bash
npm run db:view
```

This will show all tables and their data.

---

## Method 2: DB Browser for SQLite (Recommended - Visual Interface)

**Best option for viewing and editing the database visually.**

1. **Download DB Browser for SQLite:**
   - Go to: https://sqlitebrowser.org/dl/
   - Download the Windows installer
   - Install it

2. **Open the database:**
   - Open DB Browser for SQLite
   - Click "Open Database"
   - Navigate to: `C:\Users\CBT_CTR1_108\Documents\mvv\server\database\`
   - Select `myvesavote.db`
   - Click Open

3. **Browse the database:**
   - Click "Browse Data" tab
   - Select a table from the dropdown
   - View, edit, and search data
   - Run SQL queries in the "Execute SQL" tab

---

## Method 3: VS Code Extension (If using VS Code)

1. Install "SQLite Viewer" or "SQLite" extension in VS Code
2. Right-click on `myvesavote.db`
3. Select "Open Database"
4. Browse tables and run queries

---

## Method 4: Online SQLite Viewer

1. Copy the database file to a temporary location
2. Use online tools like:
   - https://sqliteviewer.app/
   - https://inloop.github.io/sqlite-viewer/
3. Upload the database file
4. Browse and query (note: don't upload sensitive data)

---

## Database Tables

The database contains these tables:
- `students` - Student records (pre-populated)
- `users` - Registered user accounts
- `admins` - Admin accounts
- `positions` - Election positions
- `contestants` - Candidates for positions
- `votes` - All submitted votes
- `announcements` - System announcements
- `settings` - System settings (registration_open, voting_open, etc.)

---

## Quick Commands

**View database:**
```bash
npm run db:view
```

**Database file location:**
```
server/database/myvesavote.db
```

---

## Important Notes

⚠️ **Backup before editing:** Always backup the database file before making manual changes

⚠️ **Be careful:** Direct database edits can break the application if data integrity is violated

✅ **Recommended:** Use the admin panel to make changes through the API instead of direct database edits

---

## Example SQL Queries (if using DB Browser)

**View all students:**
```sql
SELECT * FROM students;
```

**View all votes:**
```sql
SELECT * FROM votes ORDER BY created_at DESC;
```

**Count votes per candidate:**
```sql
SELECT c.name, COUNT(v.id) as vote_count 
FROM contestants c 
LEFT JOIN votes v ON c.id = v.contestant_id 
WHERE v.is_cancelled = 0
GROUP BY c.id;
```

**View registered users:**
```sql
SELECT reg_number, full_name, has_voted FROM users;
```

