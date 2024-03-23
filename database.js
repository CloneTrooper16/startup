const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user');
const scoreCollection = db.collection('scores');

//test database
(async function testConnection() {
    await client.connect();
    await db.command({ ping: 1 });
})().catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
});

//get functions
function getUser(userName) {
    return userCollection.findOne({ userName: userName });
}
  
function getUserByToken(token) {
    return userCollection.findOne({ token: token });
}

async function createUser(userName, password) {
    //hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
        userName: userName,
        password: passwordHash,
        token: uuid.v4(),
    };
    await userCollection.insertOne(user);
  
    return user;
}

function addScore(score) {
    scoreCollection.insertOne(score);
}

async function updateScore(score) {
    const query = { name: score.name};
    let user = await scoreCollection.findOne(query);
    if (user) {
        let newScore = user;
        if (score.wins) {
            newScore.wins++
        } else {
            newScore.losses++;
        }
        await scoreCollection.updateOne(query, { $set: newScore });
    } else {
        addScore(score);
    }
}

async function getHighScores() {
    const query = { wins: { $gt: 0, $lt: 900 } };
    const options = {
        sort: { wins: -1 },
        limit: 10,
    };
    const cursor = scoreCollection.find(query, options);
    return await cursor.toArray();
}

async function getUserScores(user) {
    return scoreCollection.findOne({name: user})
}

module.exports = {
    getUser,
    getUserByToken,
    createUser,
    addScore,
    updateScore,
    getHighScores,
    getUserScores,
};