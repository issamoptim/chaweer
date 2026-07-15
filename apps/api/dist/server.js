"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const app_1 = require("./app");
const env_1 = require("./config/env");
const logger_1 = require("./core/logger");
const server = app_1.app.listen(env_1.env.PORT, () => {
    logger_1.logger.info(`Server running on port ${env_1.env.PORT}`);
    logger_1.logger.info(`Environment: ${env_1.env.NODE_ENV}`);
});
exports.server = server;
//# sourceMappingURL=server.js.map