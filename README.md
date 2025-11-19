# Telegram ROI WebApp Frontend

A React + Vite frontend for the Telegram Mini WebApp ROI investment system.

## Features

- 🔐 Automatic authentication via Telegram WebApp initData
- 📊 Dashboard with balance, ROI, and investment stats
- 💰 Deposit system with package selection
- 💸 Withdrawal requests
- 👥 15-level referral tree with statistics
- 🎨 Clean, modern UI with TailwindCSS
- 📱 Mobile-optimized for Telegram Mini Apps

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **TailwindCSS** - Styling
- **@twa-dev/sdk** - Telegram WebApp SDK

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL to your backend URL
```

3. Run development server:
```bash
npm run dev
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

### Option 1: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Option 2: Netlify
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy --prod`
3. Follow the prompts

### Option 3: Custom Server
1. Build: `npm run build`
2. Upload `dist` folder to your web server
3. Configure HTTPS (required for Telegram Mini Apps)

## Telegram Bot Configuration

1. Set your bot's WebApp URL to the deployed frontend URL
2. Ensure HTTPS is enabled
3. The app will automatically authenticate users via Telegram initData

## Local Testing

For local testing with Telegram:
1. Use ngrok or similar to expose localhost: `ngrok http 5173`
2. Use the ngrok URL in your Telegram Bot WebApp settings
3. Or use Telegram's test mode with localhost

## Project Structure

```
webapp/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── context/        # React Context (Auth)
│   ├── utils/          # Utility functions
│   └── config/         # Configuration
├── public/             # Static assets
└── dist/               # Build output
```

## API Integration

The frontend connects to the backend API at `http://localhost:3000` by default.

All API calls include JWT authentication via Axios interceptors.

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: http://localhost:3000)
