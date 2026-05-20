import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken"
export async function auth_user(req : Request,res : Response , next : NextFunction){
    console.log(req.cookies)
    try{
        const result = jwt.verify(req.cookies.tokenid,process.env.LOGIN_JWT_KEY || "")
        // console.log(result)
        if(!result){
            return res.redirect("/login")
        }
    }catch(err){
        console.log(err)
        return res.redirect("/login")
    }
    next()
}