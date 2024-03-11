const playerWins = document.getElementById("wins");
const playerAlmostWins = document.getElementById("almostWins");

playerWins.textContent = "Wins: " + Math.floor(Math.random()*1000);
playerAlmostWins.textContent = "Almost Wins: " + Math.floor(Math.random()*1000);


async function loadScores() {
    let scores = [];
    try {
      const response = await fetch('/api/scores');
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
        const scoreTdEl = document.createElement('td');
        const dateTdEl = document.createElement('td');
  
        positionTdEl.textContent = i + 1;
        nameTdEl.textContent = score.name;
        scoreTdEl.textContent = score.score;
        dateTdEl.textContent = score.date;
  
        const rowEl = document.createElement('tr');
        rowEl.classList.add("darkList");
        rowEl.appendChild(positionTdEl);
        rowEl.appendChild(nameTdEl);
        rowEl.appendChild(scoreTdEl);
        rowEl.appendChild(dateTdEl);
  
        tableBodyEl.appendChild(rowEl);
      }
    } else {
      tableBodyEl.innerHTML = '<tr class="darkList"><td colSpan=4>Be the first to score</td></tr>';
    }
  }

  loadScores();