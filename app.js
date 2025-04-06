require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { socket } = require('./service/socket');
const { connection } = require('./service/database');
const userRouter = require('./routes/user');
const testRouter = require('./routes/test');
const predictRouter = require('./routes/predict');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/user', userRouter);
app.use('/test', testRouter);
app.use('/predict', predictRouter);

connection(process.env.DATABASE_URL);
socket(app);
