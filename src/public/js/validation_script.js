export function validation()
{
    if(!username_validate()) return false
    if(!name_validate(fname)) return false
    if(!name_validate(lname)) return false
    if(!email_validate()) return false
    if(!phone_number_validate()) return false
    if(!compare_passwords()) return false
    return true
}

const username = document.getElementById("username")
const fname = document.getElementById("fname")
const lname = document.getElementById("lname")
const email = document.getElementById("email")
const phone_number = document.getElementById("phone_number")
const password = document.getElementById("password")
const confirm_password = document.getElementById("confirm_password")

function username_validate(){
    const regex = /^[A-Za-z]{1,}[A-Za-z0-9_]{0,}$/
    // console.log(regex.test(username.value))
    remove_red_border_event(username)
    if(username.value.trim()=="" || !regex.test(username.value)){
        show_red_border(username)
        show_error("username-error","invalid username")
        return false
    }
    return true
}

function name_validate(element){
    const regex = /^[A-Za-z]{1,}$/
    remove_red_border_event(element)
    if(element.value.trim()=="" || !regex.test(element.value))
    {
        show_red_border(element)
        show_error(element.id+"-error","invalid name")
        return false;
    }
    return true
}

export function email_validate(){
    const regex = /^[A-Za-z]{1,}[A-Za-z0-9._-]{0,}@[A-Za-z]{1,}[A-Za-z0-9._-].[A-Za-z]{1,}$/
    remove_red_border_event(email)
    if(email.value.trim()=="" || !regex.test(email.value)){
        show_red_border(email)
        show_error("email-error","invalid email address")
        return false
    }
    return true
}

function phone_number_validate(){
    const regex = /^[0-9]{10}$/
    remove_red_border_event(phone_number)
    if(phone_number.value.trim()=="" || !regex.test(phone_number.value)){
        show_red_border(phone_number)
        show_error("phone_number-error","invalid phone number   ")
        return false
    }
    return true
}

function compare_passwords(){
    remove_red_border_event(password)
    remove_red_border_event(confirm_password)
    if(password.value != confirm_password.value){
        show_red_border(password)
        show_red_border(confirm_password)
        show_error(confirm_password.id+"-error","password and confirm password not matched")
        return false
    }
    return true
}

function show_error(elementid,error_msg){
    document.getElementById(elementid).innerHTML = error_msg
}
function hide_error(elementid){
    document.getElementById(elementid).innerHTML = ""
}
function show_red_border(element){
    element.style.borderColor = "red"
}
function remove_red_border_event(element){
    
    element.addEventListener("focus",()=>{
        element.style.borderColor = ""
        hide_error(element.id+"-error");
    })
}