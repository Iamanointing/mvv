# Easy Installation Guide

## Try This First - Install sqlite3 Package

I've switched the database to use `sqlite3` which might have better prebuilt binary support. Try this:

```bash
npm install
```

If `sqlite3` also fails with the same VS Build Tools error, follow the steps below.

## Properly Install Visual Studio 2022 Build Tools

The error shows you have Build Tools installed but it's not being detected correctly. Here's how to fix it:

### Step 1: Download Visual Studio 2022 Build Tools
- Go to: https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022
- Download the installer (it's only ~5MB)

### Step 2: Run Installer
1. Run the downloaded installer
2. When it opens, make sure to check:
   - ✅ **Desktop development with C++**
   - ✅ **C++ build tools** (usually auto-selected)

### Step 3: Install and Restart
1. Click Install (takes 5-10 minutes)
2. **Restart your computer** (important!)
3. Open a **new** terminal
4. Try: `npm install`

## Alternative: Use Node.js 20 LTS Instead

If you keep having issues, you can use Node.js 20 which has better prebuilt binary support:

1. Install Node.js 20 LTS from: https://nodejs.org/
2. Restart terminal
3. Run: `npm install`

## Quick Check

After installing VS Build Tools, verify it works:
```bash
npm install sqlite3 --build-from-source=false
```

If this succeeds, then run:
```bash
npm install
```

Let me know which approach works for you!

