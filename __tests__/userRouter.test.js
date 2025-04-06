const request = require('supertest');
const express = require('express');
const userRouter = require('../routes/user');
const User = require('../models/user');
const { createTokenForUser, validateToken } = require('../service/authentication');
const { createHmac } = require('crypto');
jest.mock('../models/user');
jest.mock('../service/authentication');
jest.mock('crypto', () => ({
    createHmac: jest.fn(() => ({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn(),
    })),
}));

const app = express();
app.use(express.json());
app.use('/user', userRouter);

describe('User Route Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should register a user and return a token', async () => {
        const mockUser = {
            _id: 'mockUserId',
            fullName: 'John Doe',
            email: 'john@example.com',
            password: 'hashedPassword',
        };
        User.create.mockResolvedValue(mockUser);
        User.findOne.mockResolvedValue(mockUser);
        const mockToken = 'mockToken';
        createTokenForUser.mockReturnValue(mockToken);

        const response = await request(app)
            .post('/user/register')
            .send({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ token: mockToken });
    });

    it('should validate a user with correct token', async () => {
        const mockToken = 'mockValidToken';
        const mockPayload = { _id: 'mockUserId', name: 'John Doe', email: 'john@example.com' };
        validateToken.mockReturnValue(mockPayload);

        User.findById.mockResolvedValue({ _id: 'mockUserId' });

        const response = await request(app)
            .post('/user/register')
            .send({ token: mockToken });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ msg: 'Valid user' });
    });

    it('should return Unauthorized Access if credentials are incorrect', async () => {
        User.findOne.mockResolvedValue({
            password: 'hashedPassword',
            salt: 'saltValue',
        });
        createHmac.mockImplementation(() => ({
            update: jest.fn().mockReturnThis(),
            digest: jest.fn().mockReturnValue('wrongHash'),
        }));

        const response = await request(app)
            .post('/user/validate')
            .send({
                email: 'john@example.com',
                password: 'wrongPassword',
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ msg: 'Unauthorized Access' });
    });
});
