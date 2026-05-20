"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const svg_captcha_1 = __importDefault(require("svg-captcha"));
const router = (0, express_1.Router)();
router.get("/captcha", (req, res) => {
    const captcha = svg_captcha_1.default.createMathExpr({
        mathMin: 1,
        mathMax: 9,
        mathOperator: '+-',
        noise: 2,
        background: '#cc9966',
        color: true
    });
    // console.log(captcha)
    req.session = Object.assign(req.session, { captcha_value: captcha.text });
    console.log(req.session);
    res.type("svg");
    res.status(200).send(captcha.data);
});
router.post("/varify_captcha", (req, res) => {
    console.log(req.session);
    try {
        const { captcha } = req.body;
        console.log(captcha, req.session.captcha_value);
        if (captcha == req.session.captcha_value) {
            return res.status(200).json({ message: "captcha varified" });
        }
        else {
            return res.status(400).json({ message: "captcha not varified" });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "server errir" });
    }
});
exports.default = router;
//# sourceMappingURL=captcha_routes.js.map