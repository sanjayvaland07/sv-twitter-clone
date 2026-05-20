import { get_user_by_email, get_user_by_email_username, get_user_by_phone_number, get_user_by_username, insert_user_details, update_password } from "../models/user_model";
import { Request, response, Response } from "express";
import { UserRequestBody } from "../types/userRequestBody";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { otp_payload } from "../types/userRequestBody";
import { Request_session } from "../types/express_session";

export async function check_username(req: Request, res: Response) {
    try {
        const result = await is_data_already_exist(req.body.username,get_user_by_username)
        if (result) {
            return res.status(400).json({ msg: "username is already exist" })
        }
        return res.status(200).json({ data: result })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "server error to check username" })
    }
}

export async function check_email(req: Request, res: Response) {
    try {
        const result = await is_data_already_exist(req.body.email,get_user_by_email)
        if (result) {
            return res.status(400).json({ msg: "email is already exist" })
        }
        return res.status(200).json({ data: result })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: "server error to check email" })
    }
}

export async function check_phone_number(req: Request, res: Response) {
    try {
        const result = await is_data_already_exist(req.body.phone_number,get_user_by_phone_number)
        if (result) {
            return res.status(400).json({ msg: "phone_number is already exist" })
        }

        return res.status(200).json({ data: result })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "server error to check phone number" })
    }
}

export async function register_user(req: Request, res: Response) {
    try {
        const user = req.body as UserRequestBody;
        console.log(user)
        const is_username_exist = await is_data_already_exist(user.username,get_user_by_username)
        if(is_username_exist) return res.status(400).json({msg : "username is already exist"})

        const is_email_exist = await is_data_already_exist(user.email,get_user_by_email)
        if(is_email_exist) return res.status(400).json({msg : "email is already exist"})

        const is_phone_number_exist = await is_data_already_exist(user.phone_number,get_user_by_phone_number)
        if(is_phone_number_exist) return res.status(400).json({msg : "phone number is already exist"})
        
        const hash_password = await bcrypt.hash(user.password,10)
        const result = await insert_user_details(user.username,user.fname,user.lname,user.email,user.phone_number,hash_password)
        if(result){
            // console.log("register user details",result)
            res.status(200).json({msg : "user register successfully"})
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "server error to register user" })
    }
}

export async function login_user(req : Request_session,res : Response){
    if(!req.body.user || !req.body.password){
        return res.status(400).json({msg : "invalid inputs"})
    }

    try{
        const user = req.body.user;
        const [result] : any= await get_user_by_email_username(user,user);
        console.log(result)
        const is_valid_password = await bcrypt.compare(req.body.password,result.password)
        if(!is_valid_password) return res.status(400).json({msg : "invalid login credentials"})

        const jwt_token = jwt.sign({user},process.env.LOGIN_JWT_KEY || "",{expiresIn : "5m"})
        req.session.userid = result.id
        return res.status(200).cookie("tokenid",jwt_token,{httpOnly : true}).json({msg : "login successfull"})
    }catch(err){
        console.log(err)
        return res.status(500).json({msg : "username and password is not valid"})
    }
}

export async function forget_password_check_email(req : Request,res :Response){
    try {
        const result = await is_data_already_exist(req.body.email,get_user_by_email)
        if (result.length>0) {
            console.log(result)
            const otp = Math.floor(Math.random() * 8999 + 1000)
            const jwt_token = jwt.sign({email : result[0].email,otp},process.env.FORGET_PASSWORD_JWT_KEY || "",{expiresIn : "5m"})
            return res.status(200).cookie("forgetpassword_token",jwt_token).json({ data: result })  
        }
        return res.status(400).json({ msg: "email is not registered" })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: "server error to check email" })
    }
}

async function is_data_already_exist(data: string, check_function: Function) {
    const result = await check_function(data);
    console.log(result)
    if (result.length > 0) {
        return result
    }
    return false
}

export async function otp_verify(req : Request,res : Response){
    console.log("otp verify")
    if(!req.body.otp || !req.cookies.forgetpassword_token) return res.status(400).json({msg : "wrong otp"})
    try{
        const result = jwt.verify(req.cookies.forgetpassword_token,process.env.FORGET_PASSWORD_JWT_KEY || "") as otp_payload
        if(result.otp == req.body.otp){
            return res.status(200).json({msg : "otp verify successfully"})
        }else{
            return res.status(400).json({msg : "otp is wrong"})
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({msg : "otp is expired"})
    }

}

export async function reset_password(req:Request,res : Response) {
    console.log("reset password")
    console.log(req.body)
    if(!req.body.password || !req.cookies.forgetpassword_token) return res.status(400).json({msg : "password not found"})
    try{
        const result = jwt.verify(req.cookies.forgetpassword_token,process.env.FORGET_PASSWORD_JWT_KEY || "") as otp_payload
        console.log(result.email)
        const user = await get_user_by_email(result.email);
        if(user[0].password){
            const is_same = await bcrypt.compare(req.body.password,user[0].password)
            if(is_same){
                return res.status(400).json({msg : "this password is already exist"})
            }else{
                const hash_password = await bcrypt.hash(req.body.password,10);
                const reset_result = await update_password(user[0].email,hash_password)
                console.log(reset_result)
                return res.status(200).json({msg : "password reset successfull"})
            }
        }
        return res.status(400).json({msg : "user not found"})

    }catch(err){
        console.log(err)
        return res.status(500).json({msg : "reset password link is expired"})
    }
}

export async function logout_user(req :Request,res : Response){
    req.session.destroy((err)=>{
        if(err){
            console.log(err)
            return res.status(500).json({msg : "could't logout user"})
        }
        return res.clearCookie("tokenid").clearCookie("forgetpassword_token").status(200).json({msg : "logout"})
        // res.clearCookie("forgetpassword_token")
        // return res.redirect("/login")
    })
    
}