import { Router,Request,Response } from "express";
import { check_email, check_phone_number, check_username, forget_password_check_email, login_user, logout_user, otp_verify, register_user, reset_password } from "../controllers/auth_controller";
import { auth_user } from "../middleware/auth_user_middleware";
import { auth_forget_password } from "../middleware/auth_forget_password_middleware";
import jwt from "jsonwebtoken";
import { otp_payload } from "../types/userRequestBody";

const router = Router()

router.get("/",auth_user,(req : Request,res : Response)=>{
    res.redirect("/user/home")
})
router.get("/register",(req :Request, res : Response)=>{
    res.render("register")
})
router.get("/login",(req : Request,res : Response)=>{
    res.render("login")
})
router.get("/forgetpassword",(req : Request,res : Response)=>{
    res.render("forget_password")
})
router.get("/mail_inbox",auth_forget_password,async (req : Request,res : Response)=>{
    const result = jwt.verify(req.cookies.forgetpassword_token,process.env.FORGET_PASSWORD_JWT_KEY || "") as otp_payload
    res.render("email_inbox_otp",{otp : result.otp})
})
router.get("/otp_verification",auth_forget_password,(req : Request,res : Response)=>{
    res.render("otp_verification")
})
router.get("/reset_password",auth_forget_password,(req : Request,res : Response)=>{
    res.render("reset_password")
})


router.post("/check_username",check_username)
router.post("/check_email",check_email)
router.post("/check_phone_number",check_phone_number)
router.post("/register",register_user)
router.post("/login",login_user)
router.post("/forgetpassword",forget_password_check_email)
router.post("/otp_verification",auth_forget_password,otp_verify)
router.put("/reset_password",reset_password)
router.post("/logout",logout_user)

export default router;