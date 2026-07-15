"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
function notFoundHandler(_req, res) {
    res.status(404).json({
        status: 'error',
        message: 'Route not found',
    });
}
//# sourceMappingURL=not-found.js.map