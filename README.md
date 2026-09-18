# Web Performance Analyzer Backend

A lightweight, stateless Express.js backend for analyzing website performance using Google PageSpeed Insights API.

## Features

- ✅ **Stateless**: No database or persistent state required
- ✅ **Lightweight**: Minimal dependencies, fast startup
- ✅ **Fully Typed**: TypeScript with strict mode enabled
- ✅ **Error Handling**: Comprehensive error handling and validation
- ✅ **Logging**: Structured logging with configurable levels
- ✅ **CORS Ready**: Configured for frontend integration
- ✅ **Production Ready**: Docker-ready, environment-based config

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Installation

```bash
cd express-backend
npm install
```

### Configuration

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Update `.env.local` with your values:

```env
NODE_ENV=development
PORT=8080
LOG_LEVEL=debug

# Get your API key from https://console.cloud.google.com
GOOGLE_PAGESPEED_API_KEY=your_actual_api_key_here

# Your frontend URL
CORS_ORIGIN=http://localhost:3000
```

### Getting Google PageSpeed API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable **PageSpeed Insights API**
4. Create an **API Key** in the Credentials section
5. Copy the key to `.env.local`

### Development

```bash
npm run dev
```

The server will start at `http://localhost:8080`

### Build

```bash
npm run build
```

### Production

```bash
npm run build
npm run start
```

## API Endpoints

### GET `/api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### POST `/api/analyze`

Analyze a website's performance using Google PageSpeed Insights.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "lighthouseData": {
    "audits": {
      "is-on-https": { "score": 100, "numericValue": null },
      "first-contentful-paint": { "score": null, "numericValue": 1500 },
      ...
    },
    "categories": {
      "performance": { "score": 95 },
      "accessibility": { "score": 92 },
      "best-practices": { "score": 88 },
      "seo": { "score": 100 }
    }
  },
  "puppeteerData": {
    "jsExecutionTime": 250,
    "cpuUsage": null,
    "memoryUsage": null,
    "performanceMetrics": {
      "fcpMs": 1500,
      "lcpMs": 2500,
      "clsScore": 0.1,
      "ttfb": 300
    }
    ...
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid URL format",
  "statusCode": 400
}
```

## Project Structure

```
express-backend/
├── src/
│   ├── types/               # TypeScript interfaces
│   ├── config/              # Configuration management
│   ├── utils/               # Utilities (logger, validation)
│   ├── middleware/          # Express middleware
│   ├── routes/              # API route definitions
│   ├── controllers/         # Request handlers
│   ├── services/            # Business logic
│   └── index.ts             # Application entry point
├── dist/                    # Compiled JavaScript (after build)
├── package.json
├── tsconfig.json
├── .env.example
├── .env.local              # (Create this, add to .gitignore)
└── README.md
```

## Error Handling

The backend handles various error scenarios:

- **400 Bad Request**: Invalid URL or request format
- **429 Too Many Requests**: Rate limit exceeded on PageSpeed API
- **504 Gateway Timeout**: URL analysis took too long
- **500 Internal Server Error**: Server-side errors

## Logging

Configure log level in `.env.local`:

```env
LOG_LEVEL=debug  # debug, info, warn, error
```

All requests are logged with method, URL, status code, and response time.

## Type Safety

All TypeScript types are strictly defined in `src/types/index.ts`:

- `AnalysisData` - Complete analysis response
- `LighthouseData` - Lighthouse audit results
- `PuppeteerData` - Performance metrics
- `ErrorResponse` - Error structure

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Environment mode |
| `PORT` | `8080` | Server port |
| `LOG_LEVEL` | `info` | Logging level |
| `GOOGLE_PAGESPEED_API_KEY` | _(required)_ | PageSpeed API key |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origins |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Max requests per window |

## Docker Deployment

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 8080

ENV NODE_ENV=production
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t web-perf-backend .
docker run -p 8080:8080 -e GOOGLE_PAGESPEED_API_KEY=your_key web-perf-backend
```

## Performance Notes

- **Stateless Design**: Each request is independent, no session or state management
- **API Limits**: Google PageSpeed API has rate limits (free tier: 25k requests/day)
- **Response Time**: Typically 10-30 seconds per URL depending on site complexity
- **No Caching**: Results are not cached (stateless), so same URL analyzed twice = 2 API calls

## Common Issues

### "GOOGLE_PAGESPEED_API_KEY is not set"
- Ensure `.env.local` file exists in the project root
- Verify the API key is correctly set
- Restart the development server

### "Invalid URL format"
- Ensure URL starts with `http://` or `https://`
- Example: `https://example.com` ✅, `example.com` ❌

### "Rate limit exceeded"
- Wait a moment before making new requests
- Monitor your API usage in Google Cloud Console

## Integration with Frontend

Update your Next.js frontend `.env.local`:

```env
NEXT_API_ENDPOINT=http://localhost:8080  # Development
# or
NEXT_API_ENDPOINT=https://your-backend-domain.com  # Production
```

The `/api/analyze` endpoint in your Next.js app already proxies to this backend.

## License

MIT
