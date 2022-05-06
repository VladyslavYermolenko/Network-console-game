const net = require('net');
const { exit } = require('process');
// const stream = require('stream');
const config = require('./config.json');

const allUserList = [];
const allPlayerList = [];
 
const server = net.createServer(socket => {
    function Menu(socket) {
        socket.write('The game is launched!\r\n'
            + '/start - Start the game;\r\n'
            + '/list  - Withdraw the IP:PORT of all players;\r\n'
            + '> ');
    }

    // function Start(message) {
    //     if ()
    // }

    
    
    const clientInfo = `${socket.remoteAddress}:${socket.remotePort}`;
    allUserList.push(clientInfo);
    console.log(`[+] ${clientInfo} - connected!`);
    socket.write(`[~] Connected with IP-address: ${clientInfo}\r\n\r\n`);
    Menu(socket);

    socket.on('data', message => {
        console.log(`[M] ${clientInfo}: ${message.toString()}`);
        switch (message.toString().trim()) {
            case '/start':
                break;
            case '/list':
                socket.write('List of IP:PORT of all players:\r\n');
                for (const el of allUserList) {
                    if (el !== clientInfo)
                        socket.write(`${el}\r\n`);
                }
                socket.write('\r\n');
                Menu(socket);
                break;
            default:
                socket.write('Invalid command input. Try again...\r\n');
                Menu(socket);
        }
    });

    socket.on('close', () => {
        for (let i = 0; i < allUserList.length; i++) { // for (;;) тому що потпрібен "і" та зупинка циклу в разі знаходження потрібного елементу.
            if (allUserList[i] === clientInfo) {
                allUserList.splice(i, 1);
                break;
            }
        }
        console.log(`[-] ${clientInfo} - closed`);
        socket.write('[-] Connection closed.');
    });

});

server.listen(config.port, config.host);