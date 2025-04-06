const socket = jest.fn(() => ({
    mockIo: {
        on: jest.fn(),
        emit: jest.fn()
    },
    mockClientSocket: {
        emit: jest.fn(),
        on: jest.fn(),
        disconnect: jest.fn(),
        connected: false
    }
}));

module.exports = { socket };
