const express = require('express');
const app = express();

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Return the application's default page if the path is unknown
app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});
  
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// GetScores
apiRouter.get('/scores', (_req, res) => {
    res.send(scores);
});

// get single users scores
apiRouter.get('/scores/:userName', (req, res) => {
    const userName = req.params.userName;
    const userScore = scores.find(s => s.name === userName);
    
    if (userScore) {
        res.send(userScore);
    } else {
        res.send({name: userName, wins: 0, losses: 0})
    }

    // res.send(`received param: ${userName}`);
    // res.send(scores.find(s => s.name == userName));
});

// UpdateScores
apiRouter.put('/score', (req, res) => {
    // updateUserScores(req.body, user); TODO: once authenitication exists, user this for individual scores
    scores = updateScores(req.body, scores);
    res.send(scores);
});
  
//calculates high scores
let scores = [];
function updateScores(newScore, scores) {
    let found = false;
    for (const i of scores.entries()) {
        if (newScore.name == i[1].name) {
            found = true;
            if (newScore.wins) {
                i[1].wins++;
            }
            else {
                i[1].losses++;
            }
            break;
        }
        
    }
    if (!found) {
        scores.push(newScore);
    }
    scores.sort((a,b) => b.wins - a.wins);
    // found = false;
    // for (const [i, prevScore] of scores.entries()) {
    //     if (newScore.score > prevScore.score) {
    //         scores.splice(i, 0, newScore);
    //         found = true;
    //         break;
    //     }
    // }

    // if (!found) {
    //     scores.push(newScore);
    // }

    // if (scores.length > 10) {
    //     scores.length = 10;
    // }

    return scores;
}