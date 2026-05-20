// get captcha from node
generate_captcha()
function generate_captcha() {
  const captchaDiv = document.getElementById("captcha-div");
  fetch("/captcha", {
    method: "get",
  })
    .then((response) => {
      console.log(response);
      return response.text();
    })
    .then((data) => {
      //console.log(data)
      captchaDiv.innerHTML = data;
    });
}
//varify captcha
export async function varify_captcha()
{
    console.log("verify captcha")
    const captcha = document.getElementById("captcha_input")
    const response = await fetch("/varify_captcha",{
      method : "post",
      headers : {
        'Content-Type' : "application/json"
      },
      body : JSON.stringify({captcha : captcha.value})
    })
    console.log(response)
    if(!response.ok){
      document.getElementById("error-msg").innerHTML = "captcha is invalid"
      generate_captcha()
      return false;
    }
    return true
}