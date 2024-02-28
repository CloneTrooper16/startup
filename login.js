function login() {
    const nameEl = document.querySelector("#name");
    const passwordEl = document.querySelector("#password");
    if (checkPassword(nameEl.value, passwordEl.value)) {
        localStorage.setItem("userName", nameEl.value);
        window.location.href = "play.html";
    }
    else {
        //give error message
    }
}


function checkPassword(name, password) {
    //stub function for checking that password matches the name's password
    //in the database. If name not found, will create new account
    return true;
}
  