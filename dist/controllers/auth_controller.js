"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.check_username = check_username;
exports.check_email = check_email;
exports.check_phone_number = check_phone_number;
exports.register_user = register_user;
exports.login_user = login_user;
exports.forget_password_check_email = forget_password_check_email;
exports.otp_verify = otp_verify;
exports.reset_password = reset_password;
exports.logout_user = logout_user;
const user_model_1 = require("../models/user_model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function check_username(req, res) {
    try {
        const result = await is_data_already_exist(req.body.username, user_model_1.get_user_by_username);
        if (result) {
            return res.status(400).json({ msg: "username is already exist" });
        }
        return res.status(200).json({ data: result });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "server error to check username" });
    }
}
async function check_email(req, res) {
    try {
        const result = await is_data_already_exist(req.body.email, user_model_1.get_user_by_email);
        if (result) {
            return res.status(400).json({ msg: "email is already exist" });
        }
        return res.status(200).json({ data: result });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "server error to check email" });
    }
}
async function check_phone_number(req, res) {
    try {
        const result = await is_data_already_exist(req.body.phone_number, user_model_1.get_user_by_phone_number);
        if (result) {
            return res.status(400).json({ msg: "phone_number is already exist" });
        }
        return res.status(200).json({ data: result });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "server error to check phone number" });
    }
}
async function register_user(req, res) {
    try {
        const user = req.body;
        console.log(user);
        const is_username_exist = await is_data_already_exist(user.username, user_model_1.get_user_by_username);
        if (is_username_exist)
            return res.status(400).json({ msg: "username is already exist" });
        const is_email_exist = await is_data_already_exist(user.email, user_model_1.get_user_by_email);
        if (is_email_exist)
            return res.status(400).json({ msg: "email is already exist" });
        const is_phone_number_exist = await is_data_already_exist(user.phone_number, user_model_1.get_user_by_phone_number);
        if (is_phone_number_exist)
            return res.status(400).json({ msg: "phone number is already exist" });
        const hash_password = await bcrypt_1.default.hash(user.password, 10);
        const result = await (0, user_model_1.insert_user_details)(user.username, user.fname, user.lname, user.email, user.phone_number, hash_password);
        if (result) {
            // console.log("register user details",result)
            res.status(200).json({ msg: "user register successfully" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "server error to register user" });
    }
}
async function login_user(req, res) {
    if (!req.body.user || !req.body.password) {
        return res.status(400).json({ msg: "invalid inputs" });
    }
    try {
        const user = req.body.user;
        const [result] = await (0, user_model_1.get_user_by_email_username)(user, user);
        console.log(result);
        const is_valid_password = await bcrypt_1.default.compare(req.body.password, result.password);
        if (!is_valid_password)
            return res.status(400).json({ msg: "invalid login credentials" });
        const jwt_token = jsonwebtoken_1.default.sign({ user }, process.env.LOGIN_JWT_KEY || "", { expiresIn: "5m" });
        req.session.userid = result.id;
        return res.status(200).cookie("tokenid", jwt_token, { httpOnly: true }).json({ msg: "login successfull" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "username and password is not valid" });
    }
}
async function forget_password_check_email(req, res) {
    try {
        const result = await is_data_already_exist(req.body.email, user_model_1.get_user_by_email);
        if (result.length > 0) {
            console.log(result);
            const otp = Math.floor(Math.random() * 8999 + 1000);
            const jwt_token = jsonwebtoken_1.default.sign({ email: result[0].email, otp }, process.env.FORGET_PASSWORD_JWT_KEY || "", { expiresIn: "5m" });
            return res.status(200).cookie("forgetpassword_token", jwt_token).json({ data: result });
        }
        return res.status(400).json({ msg: "email is not registered" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "server error to check email" });
    }
}
async function is_data_already_exist(data, check_function) {
    const result = await check_function(data);
    console.log(result);
    if (result.length > 0) {
        return result;
    }
    return false;
}
async function otp_verify(req, res) {
    console.log("otp verify");
    if (!req.body.otp || !req.cookies.forgetpassword_token)
        return res.status(400).json({ msg: "wrong otp" });
    try {
        const result = jsonwebtoken_1.default.verify(req.cookies.forgetpassword_token, process.env.FORGET_PASSWORD_JWT_KEY || "");
        if (result.otp == req.body.otp) {
            return res.status(200).json({ msg: "otp verify successfully" });
        }
        else {
            return res.status(400).json({ msg: "otp is wrong" });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "otp is expired" });
    }
}
async function reset_password(req, res) {
    console.log("reset password");
    console.log(req.body);
    if (!req.body.password || !req.cookies.forgetpassword_token)
        return res.status(400).json({ msg: "password not found" });
    try {
        const result = jsonwebtoken_1.default.verify(req.cookies.forgetpassword_token, process.env.FORGET_PASSWORD_JWT_KEY || "");
        console.log(result.email);
        const user = await (0, user_model_1.get_user_by_email)(result.email);
        if (user[0].password) {
            const is_same = await bcrypt_1.default.compare(req.body.password, user[0].password);
            if (is_same) {
                return res.status(400).json({ msg: "this password is already exist" });
            }
            else {
                const hash_password = await bcrypt_1.default.hash(req.body.password, 10);
                const reset_result = await (0, user_model_1.update_password)(user[0].email, hash_password);
                console.log(reset_result);
                return res.status(200).json({ msg: "password reset successfull" });
            }
        }
        return res.status(400).json({ msg: "user not found" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "reset password link is expired" });
    }
}
async function logout_user(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ msg: "could't logout user" });
        }
        return res.clearCookie("tokenid").clearCookie("forgetpassword_token").status(200).json({ msg: "logout" });
        // res.clearCookie("forgetpassword_token")
        // return res.redirect("/login")
    });
}
//# sourceMappingURL=auth_controller.js.map