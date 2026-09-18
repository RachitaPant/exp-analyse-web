# Express Backend Setup Guide

## 1. Installation

```bash
cd express-backend
npm install
```

## 2. Get Google PageSpeed API Key

### Step-by-step:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Search for **"PageSpeed Insights API"** in the search bar
4. Click on it and press **"Enable"**
5. Go to **Credentials** (left sidebar)
6. Click **"Create Credentials"** → **"API Key"**
7. Copy the generated API key

### Free Tier Limits:
- **25,000 requests per day** (free)
- After that: $25 per 25,000 requests

## 3. Create `.env.local`

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NODE_ENV=development
PORT=8080
LOG_LEVEL=debug

# Paste your API key here
GOOGLE_PAGESPEED_API_KEY=YOUR_API_KEY_HERE

# Frontend URL (for CORS)
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Optional: Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 4. Run Development Server

```bash
npm run dev
```

You should see:
```
[ISO_TIMESTAMP] [INFO] 🚀 Server running on http://localhost:8080 (development)
```

## 5. Test the API

### Health Check:
```bash
curl http://localhost:8080/api/health
```

Response:
```json
{"status":"ok","timestamp":"2026-09-19T10:30:00.000Z"}
```

### Analyze a Website:
```bash
curl -X POST http://localhost:8080/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

Expected response (takes 10-30 seconds):
```json
{
  "url": "https://example.com",
  "lighthouseData": {
    "audits": {
      "is-on-https": {"score": 100},
      "first-contentful-paint": {"score": null, "numericValue": 1500},
      ...
    },
    "categories": {
      "performance": {"score": 95},
      "accessibility": {"score": 92},
      "best-practices": {"score": 88},
      "seo": {"score": 100}
    }
  },
  "puppeteerData": {
    "jsExecutionTime": 250,
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

## 6. Update Frontend to Use Backend

Edit `web-performance-analyzer/.env.local`:

```env
# Point to your backend
NEXT_API_ENDPOINT=http://localhost:8080
```

Run frontend:
```bash
cd web-performance-analyzer
npm run dev
```

Visit `http://localhost:3000` and test the analyze feature.

## 7. Production Deployment

### Option A: Docker (Recommended)

```bash
# Build Docker image
docker build -t web-perf-backend .

# Run with your API key
docker run -p 8080:8080 \
  -e GOOGLE_PAGESPEED_API_KEY=your_key \
  -e CORS_ORIGIN=https://yourdomain.com \
  -e NODE_ENV=production \
  web-perf-backend
```

### Option B: Node.js Server

```bash
npm run build
npm run start
```

### Option C: Cloud Deployment

**Google Cloud Run:**
```bash
gcloud run deploy web-perf-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --set-env-vars GOOGLE_PAGESPEED_API_KEY=your_key,CORS_ORIGIN=https://yourdomain.com,NODE_ENV=production
```

**Heroku:**
```bash
heroku create your-app-name
heroku config:set GOOGLE_PAGESPEED_API_KEY=your_key
git push heroku main
```

## 8. Troubleshooting

### "GOOGLE_PAGESPEED_API_KEY is not set"
```bash
# Check if .env.local exists
ls -la .env.local

# Verify API key is set
echo $GOOGLE_PAGESPEED_API_KEY
```

### "Invalid URL format"
- ✅ `https://example.com`
- ❌ `example.com`
- ❌ `http://example` (incomplete domain)

### "Rate limit exceeded"
- Your API key hit the daily limit
- Wait until next day, or upgrade to paid tier

### CORS Error in Frontend
- Add frontend URL to `CORS_ORIGIN` in `.env.local`
- Separate multiple URLs with comma: `http://localhost:3000,http://localhost:3001`

### Response Takes Too Long
- First request may take 20-30 seconds
- PageSpeed API analyzes the entire site
- Subsequent requests are similarly slow (no caching in stateless design)

## 9. API Response Structure

The backend transforms Google PageSpeed API responses into your expected format:

```typescript
{
  url: string;
  lighthouseData: {
    audits: {
      "is-on-https": { score: number | null; numericValue?: number | null };
      "first-contentful-paint": { score?: number | null; numericValue?: number | null };
      "largest-contentful-paint": { score?: number | null; numericValue?: number | null };
      "max-potential-fid": { score?: number | null; numericValue?: number | null };
      "speed-index": { score?: number | null; numericValue?: number | null };
      interactive: { score?: number | null; numericValue?: number | null };
      "cumulative-layout": { score?: number | null; numericValue?: number | null };
      "server-response-time": { score?: number | null; numericValue?: number | null };
      "mainthread-work-breakdown": { score?: number | null; numericValue?: number | null };
    };
    categories: {
      performance?: { score: number };
      accessibility?: { score: number };
      "best-practices"?: { score: number };
      seo?: { score: number };
    };
  };
  puppeteerData: {
    jsExecutionTime?: number | null;
    cpuUsage?: number | null;
    memoryUsage?: number | null;
    diskIO?: number | null;
    networkRequests?: string[];
    performanceMetrics?: {
      fcpMs?: number | null;
      lcpMs?: number | null;
      clsScore?: number | null;
      ttfb?: number | null;
    };
    totalDomNodes?: number | null;
    thirdPartyRequestsCount?: number | null;
    resourceBreakdown?: Record<string, number>;
    domContentLoadedTime?: number;
    largeImages?: Array<{ src: string; width: number; height: number }>;
    longTasks?: Array<{ name: string; startTime: number; duration: number }>;
    unusedJSBytes?: Array<{ name: string; transferSize: number; encodedBodySize: number }>;
  };
}
```

## 10. Monitoring

Check logs:
```bash
# Development
npm run dev

# Production (Docker)
docker logs web-perf-backend -f

# Check health
curl http://localhost:8080/api/health
```

## Next Steps

1. ✅ Backend is ready
2. Update frontend `.env.local` with backend URL
3. Test end-to-end
4. Deploy to production
5. Monitor API usage in Google Cloud Console
