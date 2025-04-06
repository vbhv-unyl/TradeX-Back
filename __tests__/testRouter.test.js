const request = require('supertest');
const express = require('express');
const testRouter = require('../routes/test');

const app = express();
app.use(express.json());
app.use('/test', testRouter);

describe('Test Router', () => {
    it('should return health status', async () => {
        const response = await request(app).get('/test/');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ Health: "OK" });
    });

    it('should return a working message', async () => {
        const response = await request(app).post('/test/');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ msg: "Route is working fine!!" });
    });
});
