import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './core/middleware/error-handler';
import { notFoundHandler } from './core/middleware/not-found';
import { authRoutes } from './modules/auth/auth.routes';
import { profileRoutes } from './modules/profile/profile.routes';
import { professionalRoutes } from './modules/professional/professional.routes';
import { publicRoutes } from './modules/public/public.routes';
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
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

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
app.use('/profile', profileRoutes);
app.use('/professional', professionalRoutes);
app.use('/public', publicRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
