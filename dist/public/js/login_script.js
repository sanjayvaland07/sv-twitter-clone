

const loginbtn = document.getElementById("loginbtn");
const error_msg = document.getElementById("error-msg")
const user = document.getElementById("user")
const password = document.getElementById("password")

loginbtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const formdata = new FormData(document.querySelector("form"));
  const data = Object.fromEntries(formdata.entries());

  if (validate(data)) {
    const response = await fetch("/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      alert("login successfully");
      document.getElementById("error-msg").innerHTML = "";
      window.location.href = "/"
    } else {
      const data = await response.json();
      document.getElementById("error-msg").innerHTML = data.msg;
    }
  }
});

function validate(data) {
  if (data.user.trim() == "" || data.password.trim() == "") {
    user.style.borderColor = "red"
    password.style.borderColor = "red"
    document.getElementById("error-msg").innerHTML =
      "input field should not be empty";
    return false;
  } else {
    user.style.borderColor = ""
    password.style.borderColor = ""
    document.getElementById("error-msg").innerHTML = "";
    return true;
  }
}

// const forget_password = document.getElementById("forget-password-link")

// forget_password.addEventListener("click",(e)=>{
//     e.preventDefault()
//     const user = document.getElementById("user")
//     if(user.value.trim()==""){
//         error_msg.innerHTML="username or email is require"
//         user.style.borderColor="red"
//     }
// })

user.addEventListener("focus",()=>{
    user.style.borderColor = ""
    error_msg.innerHTML=""
})
password.addEventListener("focus",()=>{
    password.style.borderColor = ""
})
