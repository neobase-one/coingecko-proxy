import express, { Express, NextFunction, Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();

const PORT = 3000;
const API_SERVICE_URL = process.env.API_SERVICE_URL;
const ORIGIN_LIST = [
    'https://dashboard.neobase.one',
    'https://splits.neobase.one',
    'https://safe.neobase.one',
    'https://analytics.neobase.one',
    'https://analytics.canto.neobase.one',
    'https://analytics-staging.canto.neobase.one',
    'https://splits-staging.neobase.one',
    'https://safe-staging.neobase.one',
    'http://localhost:3000'
]

// Authorization
app.use('', (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.origin && ORIGIN_LIST.includes(req.headers.origin)) {
        next();
    }
    else {
        res.sendStatus(403);
    }
});

// Info endpoint
app.get('/info', (res: Response) => {
    res.send('This is a proxy service that proxies Coingecko APIs.');
});

// Proxy endpoint
app.use('/api', createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    headers: {
        'x-cg-pro-api-key': process.env.API_KEY_DASHBOARD || "",
    },
    logLevel: 'debug'
}));

// Start the Proxy
app.listen(PORT, () => {
    console.log(`Starting Proxy at ${PORT}`);
});