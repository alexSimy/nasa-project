const mongoose = require('mongoose');

require('dotenv').config();

// it'll only get triggered once due to "once" instead of "on"
mongoose.connection.once('open', ()=>{
    console.log('MongoDB connection ready!')
});

mongoose.connection.on('error', (err)=>{
    console.log(`Mongo Error: ${err}`);
});

async function mongoConnect(test = false) {
    await mongoose.connect(test? process.env.MONGO_URL_TEST: process.env.MONGO_URL);
}

async function mongoDisconnect(test = false) {
    await mongoose.disconnect(test? process.env.MONGO_URL_TEST: process.env.MONGO_URL);
}

module.exports = {
    mongoConnect,
    mongoDisconnect
};