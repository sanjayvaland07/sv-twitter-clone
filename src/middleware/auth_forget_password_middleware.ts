import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";

export async function auth_forget_password(req : Request, res : Response , next : NextFunction){
    if(!req.cookies.forgetpassword_token) return res.redirect("/login")
    try{
        const result = jwt.verify(req.cookies.forgetpassword_token,process.env.FORGET_PASSWORD_JWT_KEY||"")
        if(!result){
            return res.redirect("/login")
        }
        console.log(result)
    }catch(error){
        console.log(error)
        return res.redirect("/login")
    }
    next();
}