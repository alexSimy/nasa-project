require('dotenv').config();

const http = require('http');
const app = require('./app');

const {mongoConnect} = require('./services/mongo');

const {loadPlanetsData} = require('./models/planets.model');
const {loadLaunchData} = require('./models/launches.model');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);



async function startServer() {
    //load data on startup

    await mongoConnect(false);
    await loadPlanetsData();
    await loadLaunchData();

    //start listening
    server.listen(PORT, () => {
        console.log(`Listening on ${PORT}...`);
    });
};

startServer();
