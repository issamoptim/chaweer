"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const errors_1 = require("../errors");
const logger_1 = require("../logger");
function errorHandler(err, _req, res, _next) {
    if (err instanceof errors_1.AppError) {
        logger_1.logger.warn({ statusCode: err.statusCode, message: err.message }, 'Operational error');
        res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
        return;
    }
    logger_1.logger.error({ err }, 'Unexpected error');
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
}
//# sourceMappingURL=error-handler.js.map