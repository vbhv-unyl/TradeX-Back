const express = require('express');
const { socket } = require('../service/socket');
const { connection } = require('../service/database');

jest.mock('../service/socket');
jest.mock('../service/database');

let app;

beforeAll(() => {
    app = express();
    app.use(express.json());
    const { mockIo, mockClientSocket } = socket(app);
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('App Tests', () => {

    test('should connect to the database', async () => {
        const dbUrl = 'mockDatabaseUrl';
        await connection(dbUrl);

        expect(connection).toHaveBeenCalledWith(dbUrl);
        console.log(`Database connected at ${dbUrl}`);
    });

    test('should connect and receive stock price via socket', (done) => {
        const { mockIo, mockClientSocket } = socket(app);

        mockIo.emit('connection', mockClientSocket);

        mockClientSocket.on('stock_price', (data) => {
            expect(data).toEqual({ price: 100 });
            done();
        });

        mockClientSocket.emit('stock_price', { price: 100 });
    });

    test('should handle socket disconnection', (done) => {
        const { mockIo, mockClientSocket } = socket(app);

        mockIo.emit('connection', mockClientSocket);

        mockClientSocket.on('disconnect', () => {
            expect(mockClientSocket.connected).toBe(false);
            done();
        });

        mockClientSocket.disconnect();
    });
});
