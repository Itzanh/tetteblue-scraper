const tmi = require('tmi.js');
const mysql = require('mysql');

const client = new tmi.Client({
    channels: ['tetteblue']
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'tetteblue_scrapper',
    password: 'tetteblue_scrapper',
    database: 'tetteblue_scrapper',
    charset: 'utf8mb4_bin'
});

client.connect();
connection.connect();

console.log("Server ready! :D");

client.on('message', (_, tags, message, self) => {
    // console.log(`${tags['display-name']}: ${message}`);

    connection.query('INSERT INTO message (id, username, is_mod, subscriber, message, user_id) VALUES (?, ?, ?, ?, ?, ?)', [tags["id"], tags["username"], tags["mod"], tags["subscriber"], message, tags["user-id"]], function(error, results, fields) {
        if (error) throw error;
    });
});