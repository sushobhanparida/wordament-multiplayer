# Deploying Wordament Multiplayer to Vercel

This guide will help you deploy your Wordament multiplayer game to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **Node.js**: Make sure you have Node.js installed locally

## Deployment Steps

### 1. Prepare Your Repository

Make sure your repository contains:
- `package.json` (frontend)
- `backend/package.json` (backend)
- `vercel.json` (Vercel configuration)
- `api/server.js` (API route)

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Node.js project

### 3. Configure Environment Variables

In your Vercel project settings, add these environment variables:
- `NODE_ENV=production`

### 4. Update CORS Settings

Before deploying, update the CORS origin in `backend/server.js`:
```javascript
origin: process.env.NODE_ENV === 'production' 
  ? ["https://your-actual-domain.vercel.app"] 
  : "http://localhost:3000"
```

Replace `your-actual-domain` with your actual Vercel domain.

### 5. Deploy

1. Vercel will automatically build and deploy your project
2. The build process will:
   - Install dependencies for both frontend and backend
   - Build the React app
   - Set up the API routes

### 6. Test Your Deployment

1. Visit your Vercel URL
2. Test the game functionality:
   - Create a room
   - Join a room
   - Play solo mode
   - Submit words

## Troubleshooting

### Common Issues

1. **Socket.IO Connection Errors**
   - Make sure CORS is properly configured
   - Check that the frontend is connecting to the correct URL

2. **Build Errors**
   - Check that all dependencies are in `package.json`
   - Ensure `vercel.json` is properly configured

3. **API Route Issues**
   - Verify `api/server.js` exists and exports the server
   - Check that routes are properly configured in `vercel.json`

### Environment Variables

If you need to add more environment variables:
1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add any required variables

## Local Development vs Production

- **Local**: Uses `http://localhost:5000` for backend
- **Production**: Uses the same domain for both frontend and backend

## Monitoring

After deployment, monitor:
- Vercel function logs for API errors
- Browser console for frontend errors
- Socket.IO connection status

## Support

If you encounter issues:
1. Check Vercel function logs
2. Verify all files are committed to GitHub
3. Ensure environment variables are set correctly 