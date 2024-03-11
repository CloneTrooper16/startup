function displayQuote() {
    fetch('https://api.adviceslip.com/advice')
      .then((response) => response.json())
      .then((data) => {
        const containerEl = document.querySelector('#quote');
        console.log(data);
        const adviceEl = document.createElement('p');
        adviceEl.classList.add('quote');
        // const authorEl = document.createElement('p');
        // authorEl.classList.add('author');
  
        adviceEl.textContent = data.slip.advice;
        // authorEl.textContent = data.that;
  
        containerEl.appendChild(adviceEl);
        // containerEl.appendChild(authorEl);
      });
  }

displayQuote();