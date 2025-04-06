const axios = require('axios');
const { Router } = require('express');

const router = Router();

router.post('/', async (req, res) => {
    const url = process.env.FLASK_URL;
    const { ticker, duration, unit } = req.body;

    const data = {
        ticker: ticker,
        duration: duration,
        unit: unit
    };

    try {
        const response = await axios.post(url, data);
        return res.json(response.data);
    } catch (error) {
        console.error(`Unable to fetch the expected price, returned with error:`, error);

        return res.status(error.response?.status || 500).json({
            message: 'An error occurred while fetching data.',
            error: error.response ? error.response.data : error.message
        });
    }
});

module.exports = router;