const User = {
    create: jest.fn().mockResolvedValue({
        _id: 'mockUserId',
        fullName: 'Mock User',
        email: 'mockuser@example.com',
        password: 'hashedPassword',
        salt: 'mockSalt',
    }),

    findById: jest.fn().mockResolvedValue({
        _id: 'mockUserId',
        fullName: 'Mock User',
        email: 'mockuser@example.com',
    }),

    findOne: jest.fn().mockImplementation(({ email }) => {
        if (email === 'mockuser@example.com') {
            return Promise.resolve({
                _id: 'mockUserId',
                fullName: 'Mock User',
                email: 'mockuser@example.com',
                password: 'hashedPassword',
                salt: 'mockSalt',
            });
        }
        return Promise.resolve(null);
    }),

    save: jest.fn().mockResolvedValue(true),
};

module.exports = User;
