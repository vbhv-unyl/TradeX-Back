const request = require('supertest');
const express = require('express');
const predictRouter = require('../routes/predict');
const axios = require('axios');
jest.mock('axios');

const app = express();
app.use(express.json());
app.use('/predict', predictRouter);

describe('Predict Route Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return stock price from Flask API', async () => {
        const mockData = { price: 100 };
        axios.post.mockResolvedValue({ data: mockData });

        const response = await request(app)
            .post('/predict')
            .send({
                ticker: 'AAPL',
                duration: 7,
                unit: 'days'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockData);
    });

    it('should handle errors from Flask API', async () => {
        axios.post.mockRejectedValue({
            response: { status: 404, data: { message: 'Not Found' } }
        });

        const response = await request(app)
            .post('/predict')
            .send({
                ticker: 'AAPL',
                duration: 7,
                unit: 'days'
            });

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
            message: 'An error occurred while fetching data.',
            error: 'Not Found'
        });
    });
});
