(async () => {
    const userName = localStorage.getItem('userName');
    if (userName) {
        document.querySelector('#playerName').textContent = userName;
        setDisplay('loginControls', 'none');
        setDisplay('playControls', 'block');
    } else {
        setDisplay('loginControls', 'block');
        setDisplay('playControls', 'none');
    }
})();

async function loginUser() {
    loginOrCreate(`/api/auth/login`);
}
  
async function createUser() {
    loginOrCreate(`/api/auth/create`);
}

async function loginOrCreate(endpoint) {
    const userName = document.querySelector('#userName')?.value;
    const password = document.querySelector('#userPassword')?.value;
    const response = await fetch(endpoint, {
        method: 'post',
        body: JSON.stringify({ userName: userName, password: password }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    });
  
    if (response.ok) {
        localStorage.setItem('userName', userName);
        window.location.href = 'home.html';
    } else {
        const body = await response.json();
        const modalEl = document.querySelector('#msgModal');
        modalEl.querySelector('.modal-body').textContent = `⚠ Error: ${body.msg}`;
        const msgModal = new bootstrap.Modal(modalEl, {});
        msgModal.show();
    }
}

function play() {
    window.location.href = 'home.html';
}

function logout() {
    localStorage.removeItem('userName');
    fetch(`/api/auth/logout`, {
        method: 'delete',
    }).then(() => (window.location.href = '/'));
}
  
async function getUser(userName) {
    // See if we have a matching user.
    const response = await fetch(`/api/user/${userName}`);
    if (response.status === 200) {
        return response.json();
    }
  
    return null;
}

function setDisplay(controlId, display) {
    const playControlEl = document.querySelector(`#${controlId}`);
    if (playControlEl) {
        playControlEl.style.display = display;
    }
}
  

// function login() {
//     const nameEl = document.querySelector("#name");
//     const passwordEl = document.querySelector("#password");
//     if (nameEl.value == "") {
//         nameEl.value = "MysteriousPlayer";
//     }
//     if (checkPassword(nameEl.value, passwordEl.value)) {
//         localStorage.setItem("userName", nameEl.value);
//         window.location.href = "home.html";
//     }
//     else {
//         //give error message
//     }
// }

// function checkPassword(name, password) {
//     //stub function for checking that password matches the name's password
//     //in the database. If name not found, will create new account
//     return true;
// }
  