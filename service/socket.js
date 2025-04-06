const http = require('http');
const socketIo = require('socket.io');
const socketIoClient = require('socket.io-client');

function socket(app) {
    const server = http.createServer(app);
    const io = socketIo(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            allowedHeaders: ["content-type"],
            credentials: true
        }
    });
    
    const SocketUrl = process.env.SOCKET_URL;

    io.on('connection', (socket) => {
        console.log('Client connected to Node.js server');

        const Socket = socketIoClient(SocketUrl);

        Socket.on('connect', () => {
            console.log('Connected to node-micro server');
        });

        Socket.on('stock_price', (data) => {
            console.log('Received stock price from node-micro server:', data);
            socket.emit('stock_price', data);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected from Node.js server');
            Socket.disconnect();
        });
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Node.js server is running on port ${PORT}`);
    });
}

module.exports = { socket };