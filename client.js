const net = require('net');
const config = require('./config.json');

const client = new net.Socket();

client.connect(config.port, config.host, () => {
    console.log('Server connection error!\r\nTo play, connect to the server.');
});

client.on('data', _ => {});

client.on('close', () => {
    console.log('[-] Connection closed.');
});