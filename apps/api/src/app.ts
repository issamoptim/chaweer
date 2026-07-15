import express from 'express';
import { errorHandler } from './core/middleware/error-handler';
import { notFoundHandler } from './core/middleware/not-found';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'chaweer-api',
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
