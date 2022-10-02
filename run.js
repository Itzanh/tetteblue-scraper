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

client.on('message', (channel, tags, message, self) => {
    // console.log(`${channel} ${tags['display-name']}: ${message}`);

    getChannelId(channel, (channelId) => {
        if (channelId == null) {
            return;
        }

        connection.query('INSERT INTO message (id, username, is_mod, subscriber, message, user_id, channel_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [tags["id"], tags["username"], tags["mod"], tags["subscriber"], message, tags["user-id"], channelId], (error, results, fields) => {
            if (error) throw error;
        });
    });

});

function getChannelId(channelName, callback) {
    connection.query('SELECT id FROM channel WHERE name = ?', [channelName], (error, results, _) => {
        if (error) {
            callback(null);
            return;
        }
        if (results.length == 0) {
            callback(null);
            return;
        }
        callback(results[0].id);
    });
}