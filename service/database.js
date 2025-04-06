const mongoose = require('mongoose');

async function connection(URL) {
    await mongoose.connect(URL)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.log(err))
}

module.exports = { connection };