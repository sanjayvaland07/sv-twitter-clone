

const forgetpasswordbtn = document.getElementById("forgetpasswordbtn")
const email = document.getElementById("email")
const error_msg = document.getElementById("error-msg")
forgetpasswordbtn.addEventListener("click",async (e)=>{
    e.preventDefault()
    if(email_validate()){
        const response = await fetch("/forgetpassword",{
            method : 'post',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({'email' : email.value})
        })

        if(response.ok){
            window.location.href = "/otp_verification"
            window.open("/mail_inbox","_blank")
        }else{
            const data = await response.json()
            error_msg.innerHTML = data.msg
        }
    }

})

email.addEventListener("focus",()=>{
    email.style.borderColor = ""
    error_msg.innerHTML = ""
})

function email_validate(){
    const regex = /^[A-Za-z]{1,}[A-Za-z0-9._-]{0,}@[A-Za-z]{1,}[A-Za-z0-9._-].[A-Za-z]{1,}$/
    if(email.value.trim()=="" || !regex.test(email.value)){
        email.style.borderColor = "red"
        error_msg.innerHTML = "invalid email address"
        return false
    }
    return true
}