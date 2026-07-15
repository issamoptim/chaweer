import { app } from './app';
import { env } from './config/env';
import { logger } from './core/logger';

const server = app.listen(env.PORT, () => {
  logger.info(`Server running on port ${env.PORT}`);
  logger.info(`Environment: ${env.NODE_ENV}`);
});

export { server };
