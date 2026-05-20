"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth_forget_password = auth_forget_password;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function auth_forget_password(req, res, next) {
    if (!req.cookies.forgetpassword_token)
        return res.redirect("/login");
    try {
        const result = jsonwebtoken_1.default.verify(req.cookies.forgetpassword_token, process.env.FORGET_PASSWORD_JWT_KEY || "");
        if (!result) {
            return res.redirect("/login");
        }
        console.log(result);
    }
    catch (error) {
        console.log(error);
        return res.redirect("/login");
    }
    next();
}
//# sourceMappingURL=auth_forget_password_middleware.js.map