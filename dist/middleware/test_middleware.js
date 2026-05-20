"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_middleware = test_middleware;
function test_middleware(req, res, next) {
    console.log(req.ip);
    next();
}
//# sourceMappingURL=test_middleware.js.map