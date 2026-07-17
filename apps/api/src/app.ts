import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './core/middleware/error-handler';
import { notFoundHandler } from './core/middleware/not-found';
import { authRoutes } from './modules/auth/auth.routes';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
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
