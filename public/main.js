function getPlayerName() {
    return localStorage.getItem('userName') ?? 'Mystery player';
}

function getPlayerIcon() {
    return localStorage.getItem('userName') ?? 'Mystery player';
}

const userNameEl = document.querySelector('.userName');
const userIconEl = document.querySelector('.profileIcon')
userNameEl.textContent = this.getPlayerName();
userIconEl.src = "https://robohash.org/" + this.getPlayerIcon() + ".png";