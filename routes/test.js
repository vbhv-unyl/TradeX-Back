const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
    return res.json({ Health : "OK" });
});

router.post('/', (req, res) => {
    return res.json({ msg : "Route is working fine!!" });
});

module.exports = router;