# Quick Fix for better-sqlite3 Installation Error

## The Problem
`better-sqlite3` needs to compile native code, which requires Visual Studio Build Tools on Windows.

## Solution 1: Install Build Tools (Recommended - 5 minutes)

1. **Download Visual Studio Build Tools:**
   - Visit: https://visualstudio.microsoft.com/downloads/
   - Scroll down to "All Downloads" → "Tools for Visual Studio"
   - Download **"Build Tools for Visual Studio 2022"**

2. **Install:**
   - Run the installer
   - Check **"Desktop development with C++"**
   - Click Install (takes 5-10 minutes)
   - Restart your terminal

3. **Try installing again:**
   ```bash
   npm install
   ```

## Solution 2: Use Prebuilt Binary (Quick Workaround)

Try installing with the prebuilt binary flag:
```bash
npm install better-sqlite3 --build-from-source=false
npm install
```

If that doesn't work, you'll need Solution 1.

## Solution 3: Alternative - Use Different Database (Not Recommended)

We can switch to a different database that doesn't require compilation, but you'll lose some features. Only use this if Build Tools installation fails.

## What to Do Right Now

**Easiest path forward:**
1. Download Build Tools (link above) - it's a small download (~5MB installer)
2. Install it (select C++ workload)
3. Restart terminal
4. Run: `npm install`

The Build Tools are useful for many Node.js native modules, so it's worth installing.

---

**Need help?** Share any error messages you get after installing Build Tools!


