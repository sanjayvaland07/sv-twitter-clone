import { Request } from "express"
import "express-session"
declare module 'express-session'{
    interface SessionData{
        userid? : string
        captcha_value? : string
    }
}

export interface Request_session extends Request{
    session : Request['session'] & {
        userid? : string
    }
}

 