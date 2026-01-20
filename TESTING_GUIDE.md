# Complete Testing Guide - MyVesaVote

## Admin Testing Workflow

### Step 1: Add Students to Database
**Location:** Admin Dashboard → Students

1. Click "Add Student" or "Bulk Upload"
2. Add at least 3-5 test students:
   - Example:
     - Reg: `REG001`, Name: `John Doe`, Level: `100`, Dept: `Computer Science`
     - Reg: `REG002`, Name: `Jane Smith`, Level: `200`, Dept: `Mathematics`
     - Reg: `REG003`, Name: `Bob Wilson`, Level: `300`, Dept: `Physics`
3. Verify students appear in the table

### Step 2: Create Positions
**Location:** Admin Dashboard → Positions

1. Click "Add Position"
2. Create positions like:
   - "President"
   - "Secretary"
   - "Treasurer"
   - "Vice President"
3. Add descriptions if desired
4. Verify positions are created

### Step 3: Add Contestants
**Location:** Admin Dashboard → Contestants

1. Click "Add Contestant"
2. For each position, add contestants:
   - Select Position (e.g., "President")
   - Enter Name
   - Upload a photo (optional but recommended)
   - Add bio (optional)
   - Enter reg number, level, department
3. **Important:** After adding each contestant, click the checkmark ✓ to **Verify** them
4. For positions with multiple candidates, add 2-3 contestants
5. For single-candidate testing, add 1 contestant to a position

### Step 4: Enable Registration
**Location:** Admin Dashboard

1. In the Dashboard, find "Registration" toggle
2. Click to turn it **ON** (should show "Open")
3. This allows students to register accounts

### Step 5: Enable Voting
**Location:** Admin Dashboard

1. In the Dashboard, find "Voting" toggle
2. Click to turn it **ON** (should show "Open")
3. This allows registered users to vote

---

## User Testing Workflow

### Step 6: Register Test Users
**Location:** http://localhost:5173/register

1. Open a new browser window or incognito/private window (to test as different user)
2. Use registration details from Step 1:
   - Use the exact `reg_number` and `full_name` you added
   - Example: Reg `REG001`, Name `John Doe`
   - Fill in level, department, email, password
3. Click "Register"
4. You should see success message
5. **Register 2-3 test users** using different student records

### Step 7: Login as User
**Location:** http://localhost:5173/login

1. Use registered credentials:
   - Registration Number: (e.g., `REG001`)
   - Password: (what you set during registration)
2. Click "Login"

### Step 8: Test User Dashboard
**Location:** User Dashboard (after login)

1. Click "Dashboard" in navigation
2. Verify profile information displays correctly
3. Test "Report a Problem" form:
   - Fill in subject and message
   - Submit
   - Should see success message
4. Test profile picture upload (optional)

### Step 9: Test Voting Arena
**Location:** User Dashboard → Voting Arena

**For Positions with Multiple Candidates:**
1. Go to "Voting Arena"
2. You'll see all positions with their contestants
3. For each position with multiple candidates:
   - Select ONE candidate (radio button)
   - Only one selection allowed per position
4. For positions with single candidate:
   - Select YES or NO (radio buttons)
5. After selecting for ALL positions, click "Review and Confirm Votes"
6. Review your selections on the summary page
7. Click "Take Photo to Confirm Vote"
8. Allow camera access
9. Click "Capture Photo"
10. Click "Confirm and Submit Vote"
11. Should redirect to homepage with success

**Important:** Each user can only vote once!

### Step 10: Test Live Feed & Announcements
**Location:** User Home

1. After voting (or as admin), go to User Home
2. Check for announcements (if you added any as admin)
3. View voting instructions
4. Check contact section

---

## Admin Verification Testing

### Step 11: View Voter Logs
**Location:** Admin Dashboard → Votes

1. Go to "Votes" page
2. Verify all submitted votes appear
3. Each vote should show:
   - Voter name and reg number
   - Position voted for
   - Candidate/choice
   - Photo link
   - Timestamp
   - Status (Valid/Cancelled)

### Step 12: Test Vote Cancellation
**Location:** Admin Dashboard → Votes

1. Find a valid vote in the table
2. Click the X icon (cancel vote)
3. Confirm cancellation
4. Verify status changes to "Cancelled"

### Step 13: View Real-time Results
**Location:** Admin Dashboard → Results

1. Click "Results"
2. Should see:
   - All positions listed
   - Winner highlighted with trophy icon
   - Vote counts for each contestant
   - Percentages
   - Total valid votes
   - Cancelled votes count
   - Progress bars

### Step 14: Test Announcements
**Location:** Admin Dashboard → Announcements

1. Click "New Announcement"
2. Enter title and content
3. Click "Post Announcement"
4. Verify it appears in the list
5. **Check User Home** - announcement should appear there too

### Step 15: Test End Voting
**Location:** Admin Dashboard

1. After testing voting, click "End Voting" button
2. Confirm the action
3. Voting status should change to "Ended"
4. Users should no longer be able to vote
5. Results should still be visible

### Step 16: Test Registration Control
**Location:** Admin Dashboard

1. Toggle "Registration" OFF
2. Try to register a new account (in new browser)
3. Should see "Registration is closed" error
4. Toggle it back ON

---

## Edge Cases to Test

### Test 1: Duplicate Registration
- Try registering with same reg_number twice
- Should show "User already registered" error

### Test 2: Invalid Student Data
- Try registering with reg_number/name not in database
- Should show validation error

### Test 3: Vote Without Photo
- Try submitting vote without capturing photo
- Should require photo

### Test 4: Multiple Votes
- Try voting twice with same user
- Should prevent second vote

### Test 5: Voting When Closed
- Admin closes voting
- User tries to vote
- Should show "Voting is closed" message

---

## Quick Test Checklist

**Admin Features:**
- [ ] Add students (single & bulk)
- [ ] Create positions
- [ ] Add contestants with photos
- [ ] Verify contestants
- [ ] Toggle registration on/off
- [ ] Toggle voting on/off
- [ ] View voter logs
- [ ] Cancel a vote
- [ ] View results with winner cards
- [ ] Create announcements
- [ ] End voting

**User Features:**
- [ ] Register account (with valid student data)
- [ ] Login
- [ ] View profile
- [ ] Upload profile picture
- [ ] Report a problem
- [ ] View announcements on home
- [ ] Vote in Voting Arena
  - [ ] Multiple candidate positions (select one)
  - [ ] Single candidate positions (yes/no)
- [ ] Capture photo before voting
- [ ] View vote summary
- [ ] Submit vote successfully
- [ ] See live feed after voting
- [ ] Try voting twice (should fail)

**System Features:**
- [ ] Real-time updates (Socket.io)
- [ ] Database persistence
- [ ] Photo uploads working
- [ ] Results calculations correct
- [ ] Winner determination
- [ ] Vote percentages calculated

---

## Expected Results Summary

After completing all tests, you should have:
- ✅ Multiple students in database
- ✅ Multiple positions created
- ✅ Contestants added and verified
- ✅ Several registered users
- ✅ Multiple votes submitted
- ✅ Results showing winners
- ✅ Announcements visible
- ✅ All admin controls working
- ✅ Vote tracking and logs functional

---

## Troubleshooting

**If something doesn't work:**
1. Check browser console (F12) for errors
2. Check server terminal for errors
3. Verify database is initialized
4. Check that contestants are verified
5. Ensure registration/voting is enabled
6. Check network tab for API errors

**Common Issues:**
- **Can't register:** Check registration is enabled, verify student data exists
- **Can't vote:** Check voting is enabled, verify contestants are verified
- **No results:** Ensure votes were submitted and voting ended
- **Photo upload fails:** Check uploads directory exists and has permissions

---

Happy Testing! 🎉


