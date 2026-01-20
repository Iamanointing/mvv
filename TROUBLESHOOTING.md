# Troubleshooting Installation Errors

## Common Installation Issues

### 1. better-sqlite3 Compilation Errors (Windows)

If you see errors related to `better-sqlite3` compilation:

**Solution A: Install Windows Build Tools**
```bash
npm install --global windows-build-tools
```

Then try installing again:
```bash
npm run install-all
```

**Solution B: Use Prebuilt Binaries**
The package should automatically use prebuilt binaries, but if it fails:
- Make sure you have the latest Node.js version (16.x or higher)
- Try clearing npm cache: `npm cache clean --force`
- Try installing with: `npm install --build-from-source=false`

### 2. Node Version Compatibility

Ensure you have Node.js 16.x or higher:
```bash
node --version
```

If you need to update Node.js:
- Download from: https://nodejs.org/
- Install LTS version (recommended)

### 3. Permission Errors (Windows)

If you see permission errors:
- Run terminal as Administrator
- Or use: `npm install --force`

### 4. Python Not Found (for native modules)

better-sqlite3 may require Python during installation:
- Install Python 3.x from: https://www.python.org/
- During installation, check "Add Python to PATH"
- Restart terminal and try again

### 5. Alternative: Install Separately

If `npm run install-all` fails, try installing separately:

**Step 1: Backend dependencies**
```bash
npm install
```

**Step 2: Frontend dependencies**
```bash
cd client
npm install
cd ..
```

### 6. Clean Install

If you continue to have issues, try a clean install:

```bash
# Delete node_modules and package-lock files
rmdir /s /q node_modules
rmdir /s /q client\node_modules
del package-lock.json
del client\package-lock.json

# Install again
npm run install-all
```

### 7. Check Error Messages

Please share the specific error message you're seeing, and we can provide targeted solutions.

## Getting Help

If errors persist:
1. Note the exact error message
2. Check your Node.js version: `node --version`
3. Check npm version: `npm --version`
4. Share the error output for specific troubleshooting

