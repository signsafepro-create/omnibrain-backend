# 🔥 OmniBrain Backend

Unified production-grade backend API service built with Express, TypeScript, and modern Node.js.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development
npm run dev

# Production build
npm run build

# Start production server
npm start
```

## 📋 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express 5.x (latest)
- **Language**: TypeScript 7.x
- **Database**: PostgreSQL
- **Authentication**: JWT
- **API Client**: Axios
- **Security**: Helmet, CORS, Rate Limiting
- **WebSocket**: ws 8.21.0

## 📦 Core Dependencies (Latest & Secure)

| Package | Version | Security Status |
|---------|---------|----------|
| express | 5.2.1 | ✅ Latest security fixes |
| ws | 8.21.0 | ✅ DoS vulnerability fixed |
| body-parser | 1.20.6 | ✅ Limit validation improved |
| axios | 1.20.0 | ✅ Runtime hardened |
| form-data | 4.0.6 | ✅ CRLF injection protected |
| qs | 6.16.0 | ✅ Query string handling improved |
| helmet | 7.1.0 | ✅ Security headers |
| zod | 3.23.8 | ✅ Schema validation |
| jsonwebtoken | 9.0.2 | ✅ JWT authentication |
| pg | 8.11.3 | ✅ Database connectivity |

## 🔒 Recent Security Updates Applied

✅ **express@5.2.1** - Security patch for CVE-2024-51999 (reverted erroneous breaking change)
✅ **ws@8.21.0** - Fixed remote memory exhaustion DoS vulnerability
✅ **body-parser@1.20.6** - Improved limit option validation (CVE-2026-12590)
✅ **axios@1.20.0** - Hardened runtime option handling against prototype pollution
✅ **form-data@4.0.6** - CRLF injection protection in field names
✅ **qs@6.16.0** - Enhanced query string parsing and handling

## 📁 Project Structure

```
src/
├── index.ts          # Application entry point
├── config/           # Configuration files
├── routes/           # API routes
├── middleware/       # Express middleware
├── services/         # Business logic
└── utils/            # Utility functions

dist/                 # Compiled JavaScript (generated)
```

## 🔧 Configuration

Create `.env` file in root:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost/dbname
JWT_SECRET=your-secret-key
VERCEL_URL=https://your-app.vercel.app
```

## 📝 Environment Variables

- `NODE_ENV`: Development/Production mode
- `PORT`: Server port (default: 3000)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: JWT signing secret
- `VERCEL_URL`: For Vercel deployments (auto-set)

## 🚀 Deployment

### Vercel (Recommended)
✅ No Docker required  
✅ Automatic build with `npm run build`  
✅ Output directory: `dist/`  
✅ Node.js 20.x runtime  

```bash
# Deploy to Vercel
vercel deploy
```

### Docker
```bash
docker build -t omnibrain-backend .
docker run -p 3000:3000 omnibrain-backend
```

### Manual Server
```bash
npm run build
npm start
```

## 📊 Testing

```bash
npm test
```

## 📜 License

MIT

---

**Version**: 2.0.0  
**Status**: Production Ready ✅  
**Last Updated**: 2026-09-03  
**All Dependencies**: Secure & Up-to-Date
