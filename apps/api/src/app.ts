import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './core/middleware/error-handler';
import { notFoundHandler } from './core/middleware/not-found';
import { authRoutes } from './modules/auth/auth.routes';
import { env } from './config/env';

const app = express();

const allowedOrigins = env.CORS_ORIGINS.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      service: 'chaweer-api',
    },
  });
});

app.use('/auth', authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
