import { validation } from "./validation_script.js"
import { varify_captcha } from "./common/captcha.js"

const register_btn = document.getElementById("register_btn")

register_btn.addEventListener("click",async (e)=>{
    
    e.preventDefault()
    const is_captcha_true = await varify_captcha();
    console.log(is_captcha_true)
    if(validation() && is_captcha_true){
        const formdata = new FormData(document.querySelector("form"))
        const data = Object.fromEntries(formdata.entries())
        const response = await fetch("/register",{
            method : 'post',
            headers :{
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(data)
        })
        if(response.ok){
            alert("register successfully")
            document.getElementById("error-msg").innerHTML = ""
            window.location.href = "/login"

        }else{
            const data = await response.json()
            document.getElementById("error-msg").innerHTML = data.msg
        }
    }
})

const username = document.getElementById("username")
const email = document.getElementById("email")
const phone_number = document.getElementById("phone_number")


username.addEventListener("blur",async (e)=>{
    
    check_already_exist_validation(username,"/check_username","username")
})
email.addEventListener("blur",async ()=>{
    check_already_exist_validation(email,"/check_email","email")
})
phone_number.addEventListener("blur",async ()=>{
    check_already_exist_validation(phone_number,"/check_phone_number","phone_number")
})

async function check_already_exist_validation(element,api_url,fieldname){
    // console.log(element,api_url,filedname)
    try{
        // const obj = {[filedname] : element.value}
        // console.log(obj)
        const response = await fetch(api_url,{
            method : 'post',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({[fieldname] : element.value})
        })
        console.log(response)
        if(!response.ok){
            const data = await response.json()
            document.getElementById(element.id+"-error").innerHTML = data.msg;
            return false
        }else{
            document.getElementById(element.id+"-error").innerHTML = "";
            return true
        }
    }catch(err){
        throw err
        return false;
    }
}