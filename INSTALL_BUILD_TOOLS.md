# Installing Visual Studio Build Tools for better-sqlite3

## Quick Install

1. Download Visual Studio Build Tools:
   - Go to: https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022
   - Download "Build Tools for Visual Studio 2022"

2. Run the installer and select:
   - ✅ **Desktop development with C++** workload
   - ✅ **C++ build tools** (should auto-select with the workload)

3. Install (this may take 10-20 minutes)

4. Restart your terminal/computer

5. Try installing again:
   ```bash
   npm install
   ```

## Alternative: Install via Command Line

Or use Chocolatey (if you have it):
```bash
choco install visualstudio2022buildtools --package-parameters "--add Microsoft.VisualStudio.Workload.VCTools"
```


