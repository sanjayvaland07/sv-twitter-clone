import { Session } from "express-session";
import { JwtPayload } from "jsonwebtoken";
export interface UserRequestBody{
    username : string,
    fname : string,
    lname : string,
    email : string,
    phone_number :string,
    password : string
}

export interface otp_payload extends JwtPayload{
    email : string,
    otp : string
}

