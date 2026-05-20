"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth_controller");
const auth_user_middleware_1 = require("../middleware/auth_user_middleware");
const auth_forget_password_middleware_1 = require("../middleware/auth_forget_password_middleware");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
router.get("/", auth_user_middleware_1.auth_user, (req, res) => {
    res.redirect("/user/home");
});
router.get("/register", (req, res) => {
    res.render("register");
});
router.get("/login", (req, res) => {
    res.render("login");
});
router.get("/forgetpassword", (req, res) => {
    res.render("forget_password");
});
router.get("/mail_inbox", auth_forget_password_middleware_1.auth_forget_password, async (req, res) => {
    const result = jsonwebtoken_1.default.verify(req.cookies.forgetpassword_token, process.env.FORGET_PASSWORD_JWT_KEY || "");
    res.render("email_inbox_otp", { otp: result.otp });
});
router.get("/otp_verification", auth_forget_password_middleware_1.auth_forget_password, (req, res) => {
    res.render("otp_verification");
});
router.get("/reset_password", auth_forget_password_middleware_1.auth_forget_password, (req, res) => {
    res.render("reset_password");
});
router.post("/check_username", auth_controller_1.check_username);
router.post("/check_email", auth_controller_1.check_email);
router.post("/check_phone_number", auth_controller_1.check_phone_number);
router.post("/register", auth_controller_1.register_user);
router.post("/login", auth_controller_1.login_user);
router.post("/forgetpassword", auth_controller_1.forget_password_check_email);
router.post("/otp_verification", auth_forget_password_middleware_1.auth_forget_password, auth_controller_1.otp_verify);
router.put("/reset_password", auth_controller_1.reset_password);
router.post("/logout", auth_controller_1.logout_user);
exports.default = router;
//# sourceMappingURL=auth_routes.js.map