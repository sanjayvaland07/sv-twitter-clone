import { NextFunction, Request, Response } from "express";

export function test_middleware(req : Request,res : Response,next : NextFunction){
    console.log(req.ip)
    next();
}