const net = require('net');
const config = require('./config.json');
 
const playerList = [];
let existingWords = [];
let gameIsStartMsg = gameIsStart = false;
let currentMove = 0;
let lastLetter = 'a';

const server = net.createServer(socket => {
    const clientInfo = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`[+] ${clientInfo} - connected!`);
    socket.write(`[~] Connected with IP-address: ${clientInfo}\r\n\r\n`);

    if (!gameIsStart) {
        playerList.push(socket);
        if (playerList.length === 1) {
            socket.write('Waiting for the second player...\r\n');
        }
        else {
            gameIsStart = true;
            gameIsStartMsg = true;
        }
    }
    else {
        socket.write('The room is full or the game has already started.\r\n');
    }

    if (gameIsStartMsg) {
        existingWords = [];
        gameIsStartMsg = false;
        playerList.forEach(client => {
            console.log('[!] Game is start!');
            client.write('Game is start!\r\n');
            client.write(`Start with any word that starts with the letter ${lastLetter}.\r\n`);
        });
    }

    socket.on('data', message => {
        console.log(`[M] ${clientInfo}: ${message.toString()}`);
        let word = message.toString().trim();
        if (playerList.includes(socket)) {
            if (currentMove === playerList.indexOf(socket)) {
                if (!existingWords.includes(word)) {
                    if (lastLetter === word[0]) {
                        playerList.forEach(client => {
                            if (client !== socket) {
                                client.write(message.toString() + '\r\n');
                            }
                        });
                        existingWords.push(word);
                        lastLetter = word[word.length - 1];
                        playerList.forEach(client => {
                            if (client !== socket) {
                                client.write('Your turn!\r\n'.toString());
                            }
                        });
                        currentMove += 1;
                        currentMove = currentMove % 2;
                    }
                    else socket.write("The first letter must be the same as the last letter of the opponent's word.\r\n");
                }
                else socket.write('Such a word already existed.\r\n');
            }
            else socket.write('Now is not your turn.\r\n')
        }
        else socket.write('The room is full or the game has already started.\r\n');
    });

    socket.on('close', () => {
        if (playerList.includes(socket)) {
            gameIsStart = false;
            let index = playerList.indexOf(socket);
            playerList.slice(index, 1);
            playerList.forEach(client => {
                client.write('The player has given up. You won!\r\n\r\n');
            });
        }
        console.log(`[-] ${clientInfo} - closed.`);
        socket.write('[-] Connection closed.\r\n');
    });

});

server.listen(config.port, config.host);

server.on('listening', () => {
    console.log('Listening on', server.address());
});
