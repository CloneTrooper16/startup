const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');

const authCookieName = 'token';

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Trust headers that are forwarded from the proxy so we can determine IP addresses
app.set('trust proxy', true);

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
    if (await DB.getUser(req.body.userName)) {
        res.status(409).send({ msg: 'Existing user' });
    } else {
        const user = await DB.createUser(req.body.userName, req.body.password);
    
        // Set the cookie
        setAuthCookie(res, user.token);
    
        res.send({
            id: user._id,
        });
    }
});

// GetAuth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
    const user = await DB.getUser(req.body.userName);
    if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
            setAuthCookie(res, user.token);
            res.send({ id: user._id });
            return;
        }
    }
    res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
    res.clearCookie(authCookieName);
    res.status(204).end();
});

// GetUser returns information about a user
apiRouter.get('/user/:userName', async (req, res) => {
    const user = await DB.getUser(req.params.userName);
    if (user) {
        const token = req?.cookies.token;
        res.send({ userName: user.userName, authenticated: token === user.token });
        return;
    }
    res.status(404).send({ msg: 'Unknown' });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});
  
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

//error handling
app.use(function (err, req, res, next) {
    res.status(500).send({ type: err.name, message: err.message });
});

// secureApiRouter verifies credentials for endpoints
var secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
    authToken = req.cookies[authCookieName];
    const user = await DB.getUserByToken(authToken);
    if (user) {
        next();
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

// GetScores
secureApiRouter.get('/scores', async (req, res) => {
    const scores = await DB.getHighScores();
    res.send(scores);
});

// get single users scores
secureApiRouter.get('/scores/:userName', (req, res) => {
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
secureApiRouter.put('/score', async (req, res) => {
    const score = { ...req.body, ip: req.ip };
    console.log(score);
    let response = await DB.updateScore(score);
    console.log(response);
    const scores = await DB.getHighScores();
    res.send(scores);
});


// secureApiRouter.put('/score', (req, res) => {
//     // updateUserScores(req.body, user); TODO: once authenitication exists, user this for individual scores
//     scores = updateScores(req.body, scores);
//     res.send(scores);
// });
  
//calculates high scores
// let scores = [];
// function updateScores(newScore, scores) {
//     let found = false;
//     for (const i of scores.entries()) {
//         if (newScore.name == i[1].name) {
//             found = true;
//             if (newScore.wins) {
//                 i[1].wins++;
//             }
//             else {
//                 i[1].losses++;
//             }
//             break;
//         }
        
//     }
//     if (!found) {
//         scores.push(newScore);
//     }
//     scores.sort((a,b) => b.wins - a.wins);
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

//     return scores;
// }

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
    res.cookie(authCookieName, authToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });
}