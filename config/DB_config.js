const MONGOOSE = require('mongoose');
require('dotenv').config();

const DB_CONNECTION = async() => {
    try {
        await MONGOOSE.connect(process.env.MONGO_URL);
    } catch (error) {
        throw new Error('Error a la hora de iniciar la base de datos');
    }
};

module.exports = {
    DB_CONNECTION,
};