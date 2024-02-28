function getPlayerName() {
    return localStorage.getItem('userName') ?? 'Mystery player';
}

function getPlayerIcon() {
    return localStorage.getItem('userName') ?? 'Mystery player';
}

const playerNameEl = document.querySelector('.userName');
const playerIconEl = document.querySelector('.profileIcon')
playerNameEl.textContent = this.getPlayerName();
playerIconEl.src = "https://robohash.org/" + this.getPlayerIcon() + ".png";