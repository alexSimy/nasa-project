const mongoose = require('mongoose');
const launcheSchema = require('./launches.mongo');

const planetsSchema = new mongoose.Schema({
    keplerName: {
        type: String, 
        required: true,
    }
});


// Connects planetsSchema with "launches" collection
module.exports = mongoose.model('Planet', planetsSchema);