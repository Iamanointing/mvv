# MyVesaVote - Student Union Voting System

A comprehensive web-based voting system for student union elections with real-time results tracking, admin controls, and secure voting mechanisms.

## Features

### Admin Features
- Manage site content and contestants
- Real-time election results tracking
- Control registration and voting periods
- Student database management
- Vote verification and cancellation
- Announcement system
- Detailed voting analytics

### User Features
- Secure registration with student database verification
- Profile management
- Voting arena with candidate selection
- Real-time election statistics
- Vote confirmation with live photo capture
- One-time voting system

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: SQLite
- **Real-time**: Socket.io
- **Authentication**: JWT
- **File Upload**: Multer

## Quick Start

### Local Development

1. **Install Dependencies**
   ```bash
   npm run install-all
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000



## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Quick Deploy
- **Frontend**: Deploy to [Vercel](https://vercel.com)
- **Backend**: Deploy to [Render](https://render.com) or [Railway](https://railway.app)

## Project Structure

```
mvv/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts (Auth, Socket)
│   │   ├── layouts/       # Layout components
│   │   ├── pages/         # Page components
│   │   └── config/        # Configuration files
│   └── package.json
├── server/                # Express backend
│   ├── routes/           # API routes
│   ├── database/         # Database setup and helpers
│   └── uploads/          # Uploaded files
└── package.json          # Root package.json
```

## Environment Variables

### Backend (.env)
```
NODE_ENV=production
PORT=5000
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (.env or Vercel Environment Variables)
```
VITE_API_URL=https://your-backend.onrender.com
```

## API Endpoints

- `/api/auth` - Authentication (login, register)
- `/api/admin` - Admin operations
- `/api/user` - User operations
- `/api/voting` - Voting operations
- `/api/results` - Election results
- `/api/announcements` - Announcements

## Database

SQLite database is automatically initialized on first run. The database file is located at `server/database/voting.db`.

To view database contents:
```bash
npm run db:view
```

## License

ISC

## Support

For deployment issues, refer to [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
