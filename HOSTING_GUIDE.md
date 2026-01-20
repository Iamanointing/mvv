# MyVesaVote - Hosting Guide for Testing

## Option 1: Local Network Testing (Easiest - No Setup)

**Access from other devices on your Wi-Fi network**

1. Find your local IP address:
   - Windows: Run `ipconfig` in PowerShell, look for "IPv4 Address" (usually 192.168.x.x)
   - Mac/Linux: Run `ifconfig` or `ip addr`

2. Update your Vite config to allow external access:
   - Edit `client/vite.config.js` and add:
   ```javascript
   export default {
     server: {
       host: '0.0.0.0', // Allows external access
       port: 5173
     }
   }
   ```

3. Update CORS in `server/index.js` to allow your local IP:
   ```javascript
   app.use(cors({
     origin: ['http://localhost:5173', 'http://YOUR_IP:5173']
   }));
   ```

4. Access from other devices:
   - Frontend: `http://YOUR_IP:5173`
   - Backend API: `http://YOUR_IP:5000`

**Pros:** Free, instant, no signup
**Cons:** Only works on same network, IP changes on reconnection

---

## Option 2: Tunneling Services (Best for Quick External Testing)

### A. ngrok (Most Popular)

1. Install ngrok: https://ngrok.com/download
2. Sign up for free account (get auth token)
3. Run your dev server: `npm run dev`
4. In a new terminal, run:
   ```bash
   ngrok http 5173
   ```
   Or for backend:
   ```bash
   ngrok http 5000
   ```

**Pros:** Free, instant public URL, works from anywhere
**Cons:** Free tier has session limits, URL changes each time (unless paid)

### B. Cloudflare Tunnel (Free, More Stable)

1. Install Cloudflare Tunnel: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
2. Authenticate: `cloudflared tunnel login`
3. Create tunnel: `cloudflared tunnel create myvesavote`
4. Run: `cloudflared tunnel --url http://localhost:5173`

**Pros:** Free, stable URLs, more reliable than ngrok free tier
**Cons:** Requires Cloudflare account

---

## Option 3: Free Hosting Platforms (Best for Permanent Testing)

### A. Render (Recommended for Full-Stack)

**Setup:**
1. Sign up at https://render.com
2. Create a new "Web Service"
3. Connect your GitHub repository
4. Build settings:
   - Build Command: `npm install && cd client && npm install && npm run build`
   - Start Command: `npm start` (you'll need to create this)
   - Environment: Node

5. Add environment variables in Render dashboard

**Pros:** Free tier available, automatic deployments, SSL included
**Cons:** Free tier spins down after inactivity (takes time to wake up)

**Note:** You'll need to:
- Create a `start` script in `package.json`
- Configure production build
- Update CORS to allow Render URLs

### B. Railway (Great for Databases)

1. Sign up at https://railway.app
2. New Project → Deploy from GitHub
3. Add PostgreSQL (or keep SQLite for testing)
4. Set environment variables
5. Deploy

**Pros:** Free tier with $5 credit, easier database setup
**Cons:** Requires credit card (but won't charge on free tier)

### C. Vercel (Frontend) + Render/Railway (Backend)

**Frontend on Vercel:**
1. Sign up at https://vercel.com
2. Import your GitHub repo
3. Set root directory to `client`
4. Build settings: `npm install && npm run build`
5. Deploy

**Backend on Render/Railway:**
- Follow steps above

**Pros:** Best performance, Vercel is optimized for React
**Cons:** Requires separate hosting for frontend/backend

### D. Fly.io (Good for Full-Stack)

1. Install Fly CLI: `npm install -g @fly/cli`
2. Sign up: `fly auth signup`
3. Initialize: `fly launch`
4. Deploy: `fly deploy`

**Pros:** Free tier, global edge deployment
**Cons:** Requires Docker setup (but Fly can generate Dockerfile)

---

## Option 4: Production Build Setup

Before deploying, you need to configure production builds:

### Step 1: Create production start script

Add to `package.json`:
```json
{
  "scripts": {
    "start": "node server/index.js",
    "build": "cd client && npm run build",
    "build:client": "cd client && npm run build"
  }
}
```

### Step 2: Configure production CORS

Update `server/index.js`:
```javascript
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL] 
  : ['http://localhost:5173'];

app.use(cors({ origin: allowedOrigins }));
```

### Step 3: Serve static files

Add to `server/index.js`:
```javascript
const path = require('path');

// Serve static files from React app
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}
```

### Step 4: Create .env file

Create `.env`:
```
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-url.com
JWT_SECRET=your-secret-key-here
```

---

## Quick Start Recommendation

**For immediate testing:**
1. Use **ngrok** or **Cloudflare Tunnel** - fastest way to share externally
2. Update CORS to allow the tunnel URL

**For more permanent testing:**
1. Use **Render** for full-stack deployment
2. Or use **Vercel** (frontend) + **Railway** (backend) for better performance

---

## Environment Variables Needed

Create a `.env` file in the root:
```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

For production, set these in your hosting platform's environment variables.

---

## Database Considerations

- **SQLite** works fine for testing but has limitations in production
- For production, consider:
  - PostgreSQL (Render, Railway, Supabase)
  - MySQL (PlanetScale)
  - MongoDB Atlas (if you want NoSQL)

You can keep SQLite for now and migrate later.

