"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth_user = auth_user;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function auth_user(req, res, next) {
    console.log(req.cookies);
    try {
        const result = jsonwebtoken_1.default.verify(req.cookies.tokenid, process.env.LOGIN_JWT_KEY || "");
        // console.log(result)
        if (!result) {
            return res.redirect("/login");
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect("/login");
    }
    next();
}
//# sourceMappingURL=auth_user_middleware.js.map