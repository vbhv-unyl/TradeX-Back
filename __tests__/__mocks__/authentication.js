const JWT = require('jsonwebtoken');

const createTokenForUser = jest.fn((user) => {
    return 'mockToken';
});

const validateToken = jest.fn((token) => {
    if (token === 'mockToken') {
        return { _id: 'mockUserId', name: 'Mock User', email: 'mockuser@example.com' };
    }
    throw new Error('Invalid token');
});

module.exports = {
    createTokenForUser,
    validateToken,
};
