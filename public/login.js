function login() {
    const nameEl = document.querySelector("#name");
    const passwordEl = document.querySelector("#password");
    if (nameEl.value == "") {
        nameEl.value = "MysteriousPlayer";
    }
    if (checkPassword(nameEl.value, passwordEl.value)) {
        localStorage.setItem("userName", nameEl.value);
        window.location.href = "home.html";
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
  