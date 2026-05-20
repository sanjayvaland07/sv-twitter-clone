import { Router,Request,Response } from "express";
import svgcaptcha from "svg-captcha"
const router = Router()

router.get("/captcha",(req : Request,res : Response)=>{
    const captcha = svgcaptcha.createMathExpr({
        mathMin : 1,
        mathMax : 9,
        mathOperator : '+-',
        noise : 2,
        background : '#cc9966',
        color : true
    })
    // console.log(captcha)
    req.session = Object.assign(req.session,{captcha_value : captcha.text})
    console.log(req.session)
    res.type("svg")
    res.status(200).send(captcha.data)
})

router.post("/varify_captcha",(req : Request,res : Response)=>{
    console.log(req.session)
    try{
        const {captcha} = req.body
        console.log(captcha,req.session.captcha_value)
        if(captcha == req.session.captcha_value){
            return res.status(200).json({message : "captcha varified"})
        }else{
            return res.status(400).json({message : "captcha not varified"})
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({message : "server errir"})
    }
   
})

export default router;
