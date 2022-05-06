const net = require('net');
const { mainModule } = require('process');
// const stream = require('stream');
const config = require('./config.json');

const allUserList = [];
const playerInGame = [];
const server = net.createServer(socket => {
    function Menu(socket) {
        socket.write('The game is launched!\r\n'
            + '/start - Start the game;\r\n'
            + '/list  - Withdraw the IP:PORT of all players;\r\n'
            + '> ');
    }

    function Game() {
        socket.on('data', message => {
            console.log(`Test ${message.toString()}`);
        });    
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
                playerInGame.push(clientInfo);
                // if (clientInfo.length >= 2) {
                    
                // }
                Game();
                Menu(socket);
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
        let index = allUserList.indexOf(socket);
        allUserList.slice(index, 1); 
        console.log(`[-] ${clientInfo} - closed`);
        socket.write('[-] Connection closed.');
    });

});

server.listen(config.port, config.host);

server.on('listening', () => {
    console.log('Listening on', server.address());
});
