import express from 'express';
import cors from 'cors';
import { getServerPosts } from './content.js';

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json());

// API router
const apiRouter = express.Router();

// Logging and monitoring state for API
let apiStatus = {
  uptime: Date.now(),
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  lastError: null as string | null,
  status: 'online',
  incidents: [] as { id: number; date: string; status: string; title: string; description: string }[]
};

let incidentCounter = 1;

const monitorMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  apiStatus.totalRequests++;
  
  // Intercept response finish
  res.on('finish', () => {
    if (res.statusCode >= 400) {
      apiStatus.failedRequests++;
    } else {
      apiStatus.successfulRequests++;
    }
  });
  
  // Intercept errors
  const originalSend = res.send;
  res.send = function (body) {
    if (res.statusCode >= 500) {
      apiStatus.lastError = typeof body === 'string' ? body : 'Internal Server Error';
      
      // Push actual incident
      apiStatus.incidents.unshift({
        id: incidentCounter++,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + ' at ' + new Date().toLocaleTimeString(),
        status: 'unresolved',
        title: 'Internal Server Error',
        description: `An error occurred on ${req.method} ${req.originalUrl}. This incident was automatically logged.`
      });
      
      // Keep only last 10 incidents
      if (apiStatus.incidents.length > 10) {
        apiStatus.incidents.pop();
      }
    }
    return originalSend.call(this, body);
  };

  next();
};

apiRouter.use(monitorMiddleware);

// GET /api/v1/status
apiRouter.get('/status', (req, res) => {
  res.json({
    uptimeSeconds: Math.floor((Date.now() - apiStatus.uptime) / 1000),
    totalRequests: apiStatus.totalRequests,
    successfulRequests: apiStatus.successfulRequests,
    failedRequests: apiStatus.failedRequests,
    lastError: apiStatus.lastError,
    status: apiStatus.status,
    incidents: apiStatus.incidents
  });
});

// GET /api/v1/posts
apiRouter.get('/posts', async (req, res) => {
  try {
    const posts = await getServerPosts();
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string);

    if (limit) {
      const start = (page - 1) * limit;
      const end = start + limit;
      res.json({
        data: posts.slice(start, end),
        pagination: {
          total: posts.length,
          page,
          limit,
          totalPages: Math.ceil(posts.length / limit)
        }
      });
    } else {
      res.json({
        data: posts,
        pagination: {
          total: posts.length,
          page: 1,
          limit: posts.length,
          totalPages: 1
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET /api/v1/posts/recent
apiRouter.get('/posts/recent', async (req, res) => {
  try {
    const posts = await getServerPosts();
    const limit = parseInt(req.query.limit as string) || 3;
    res.json({
      data: posts.slice(0, limit)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch recent posts' });
  }
});

app.use('/api/v1', apiRouter);

export default app;
