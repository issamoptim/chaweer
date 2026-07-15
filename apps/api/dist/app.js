"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const error_handler_1 = require("./core/middleware/error-handler");
const not_found_1 = require("./core/middleware/not-found");
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'chaweer-api',
    });
});
app.use(not_found_1.notFoundHandler);
app.use(error_handler_1.errorHandler);
//# sourceMappingURL=app.js.map