function getPlayerName() {
  return localStorage.getItem('userName') ?? 'Mystery player';
}

const playerWins = document.getElementById("wins");
const playerAlmostWins = document.getElementById("almostWins");
const playerNameEl = document.querySelector('.playerName');
this.getUserScores();

playerNameEl.textContent = this.getPlayerName() + "'s Scores";

async function getUserScores() {
  let userData = [0,0];
  try {
    userName = localStorage.getItem('userName') ?? 'Mystery player';
    const response = await fetch(`/api/scores/${userName}`);
    userData = await response.json();
    // const data = await response.json();
    // console.log("UserData:", userData);
    playerWins.textContent = "Wins: " + userData.wins;
    playerAlmostWins.textContent = "Almost Wins: " + userData.losses;
    // return userData;
  } catch {
    console.log(`error getting ${userName}'s score`);
  }
}

async function loadScores() {
    let scores = [];
    try {
      const response = await fetch('/api/scores');
    //   console.log("repons", response);
      scores = await response.json();
      localStorage.setItem('scores', JSON.stringify(scores));
    } catch {
      const scoresText = localStorage.getItem('scores');
      if (scoresText) {
        scores = JSON.parse(scoresText);
      }
    }

    displayScores(scores);
  }
  
  function displayScores(scores) {
    const tableBodyEl = document.querySelector('#scores');
  
    if (scores.length) {
      for (const [i, score] of scores.entries()) {
        const positionTdEl = document.createElement('td');
        const nameTdEl = document.createElement('td');
        const winTdEl = document.createElement('td');
        const lossesTdEl = document.createElement('td');
  
        positionTdEl.textContent = i + 1;
        nameTdEl.textContent = score.name;
        winTdEl.textContent = score.wins;
        lossesTdEl.textContent = score.losses;
  
        const rowEl = document.createElement('tr');
        rowEl.classList.add("darkList");
        rowEl.appendChild(positionTdEl);
        rowEl.appendChild(nameTdEl);
        rowEl.appendChild(winTdEl);
        rowEl.appendChild(lossesTdEl);
  
        tableBodyEl.appendChild(rowEl);
      }
    } else {
      tableBodyEl.innerHTML = '<tr class="darkList"><td colSpan=4>Be the first to score</td></tr>';
    }
  }

  loadScores();


