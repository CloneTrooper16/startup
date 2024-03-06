const playerWins = document.getElementById("wins");
const playerAlmostWins = document.getElementById("almostWins");

playerWins.textContent = "Wins: " + Math.floor(Math.random()*1000);
playerAlmostWins.textContent = "Almost Wins: " + Math.floor(Math.random()*1000);