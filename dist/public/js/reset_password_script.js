const submitbtn = document.getElementById("submitbtn")
const password = document.getElementById("password")
const confirm_password = document.getElementById("confirm_password")
const error_msg = document.getElementById("error-msg")

submitbtn.addEventListener("click",async (e)=>{
    e.preventDefault()
    if(passwords_validate(password,confirm_password)){
        const response = await fetch("/reset_password",{
            method : 'put',
            headers  : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({password : password.value})
        })

        if(response.ok){
            alert("password reset successfully")
            window.location.href = "/login"
        }else{
            const data = await response.json()
            error_msg.innerHTML = data.msg;
        }
    }
})

function passwords_validate(password,confirm_password){
    if(password.value.trim() == "" || confirm_password.value.trim()=="")
    {
        password.style.borderColor="red"
        confirm_password.style.borderColor="red"
        error_msg.innerHTML = "password and confirm password should be same"
        return false;
    }else if(password.value != confirm_password.value){
        password.style.borderColor="red"
        confirm_password.style.borderColor="red"
        error_msg.innerHTML = "password and confirm password should be same"
        return false;
    }
    return true;
}

password.addEventListener("focus",()=>{
    password.style.borderColor = ""
    error_msg.innerHTML = ""
})
confirm_password.addEventListener("focus",()=>{
    confirm_password.style.borderColor = ""
    error_msg.innerHTML = ""
})
