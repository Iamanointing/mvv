# Getting Started - MyVesaVote

## Step 1: Start the Application

Open terminal in the project directory and run:

```bash
npm run dev
```

This will start:
- Backend server on: http://localhost:5000
- Frontend app on: http://localhost:5173

Wait until you see both servers running successfully.

## Step 2: Access the Application

Open your browser and go to:
```
http://localhost:5173
```

## Step 3: Initial Admin Setup

### Login as Admin
1. Click on "Admin Login" or go to: http://localhost:5173/admin/login
2. **Username:** `admin`
3. **Password:** `admin123`

⚠️ **Important:** Change this password in production!

### First Things to Do as Admin:

1. **Add Students to Database**
   - Go to "Students" in the admin menu
   - Click "Add Student" or "Bulk Upload"
   - Add student records with: Registration Number, Full Name, Level, Department, Email

2. **Create Positions**
   - Go to "Positions" in the admin menu
   - Click "Add Position"
   - Examples: "President", "Secretary", "Treasurer", etc.

3. **Add Contestants**
   - Go to "Contestants" in the admin menu
   - Click "Add Contestant"
   - Fill in details and upload photo
   - Click the checkmark to **Verify** each contestant

4. **Control System**
   - Go to "Dashboard"
   - Toggle "Registration" ON to allow students to register
   - When ready, toggle "Voting" ON to start voting
   - After voting ends, toggle "End Voting"

## Step 4: User Registration & Voting

### For Students/Users:

1. **Register Account**
   - Go to: http://localhost:5173/register
   - Enter registration details
   - Registration number and name must match a student in the database

2. **Login**
   - Go to: http://localhost:5173/login
   - Use your registration number and password

3. **Vote**
   - Navigate to "Voting Arena"
   - Select candidates for each position
   - Review your choices
   - Take a live photo (required!)
   - Submit your vote

## Step 5: View Results

As Admin:
- Go to "Results" page to see real-time election results
- View detailed vote breakdowns
- See winner cards with statistics

---

## Quick Reference

**Start App:**
```bash
npm run dev
```

**Stop App:**
Press `Ctrl + C` in the terminal

**Admin Login:**
- URL: http://localhost:5173/admin/login
- Username: `admin`
- Password: `admin123`

**User Login:**
- URL: http://localhost:5173/login
- Register first with a valid student record

---

## Troubleshooting

If the app doesn't start:
1. Make sure ports 5000 and 5173 are not in use
2. Check that Node.js is installed: `node --version`
3. Ensure all dependencies installed: `npm list`

Need help? Check the error messages in the terminal!

