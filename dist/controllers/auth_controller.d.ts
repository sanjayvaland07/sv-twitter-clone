import { Request, Response } from "express";
import { Request_session } from "../types/express_session";
export declare function check_username(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function check_email(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function check_phone_number(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function register_user(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function login_user(req: Request_session, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function forget_password_check_email(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function otp_verify(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function reset_password(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function logout_user(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=auth_controller.d.ts.map