
function displayQuote() {
    let bannedIDs = [24,27,28,29,31,33,34,37,38,46,75,76,80,114,181,183,203];
    let brokenIDs = [22,48,67,225];
    fetch(`https://api.adviceslip.com/advice`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.slip.id);
        if (bannedIDs.find(id => id == data.slip.id)) {
            // console.log("banned!");
            displayQuote();
        } else {
            const containerEl = document.querySelector('#quote');
            // console.log(data.slip);
            const adviceEl = document.createElement('p');
            adviceEl.classList.add('quote');
            // const authorEl = document.createElement('p');
            // authorEl.classList.add('author');
      
            adviceEl.textContent = data.slip.advice;
            // authorEl.textContent = data.that;
      
            containerEl.appendChild(adviceEl);
            // containerEl.appendChild(authorEl);
        }

      });
  }

displayQuote();