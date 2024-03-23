const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user');
const scoreCollection = db.collection('score');

//test database
(async function testConnection() {
    await client.connect();
    await db.command({ ping: 1 });
})().catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
});

//get functions
function getUser(email) {
    return userCollection.findOne({ email: email });
}
  
function getUserByToken(token) {
    return userCollection.findOne({ token: token });
}

async function createUser(email, password) {
    //hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
        email: email,
        password: passwordHash,
        token: uuid.v4(),
    };
    await userCollection.insertOne(user);
  
    return user;
}

function addScore(score) {
    scoreCollection.insertOne(score);
}

function getHighScores() {
    const query = { score: { $gt: 0, $lt: 900 } };
    const options = {
        sort: { score: -1 },
        limit: 10,
    };
    const cursor = scoreCollection.find(query, options);
    return cursor.toArray();
}

module.exports = {
    getUser,
    getUserByToken,
    createUser,
    addScore,
    getHighScores,
};