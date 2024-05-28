const axios = require('axios');

const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

// const launches = new Map();

//let latestFlightNumber = 100;
const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

/*
const sampleLaunch = {
    flightNumber: 100, // flight_number
    mission: 'Kepler Exploration X', // name
    rocket: 'Explorer IS1', // rocket.name
    launchDate: new Date('December 27, 2030'), // date_local
    target: 'caca', // not applicable
    customers: ['NASA', 'ZTM'], // payloads customers
    upcoming: true, //upcoming
    success: true, // success
};
// launches.set(launch.flightNumber, launch);
// saveLaunch(sampleLaunch);
*/

async function populateDB(){
    const spaceXApiQuery = {
        query:{},
        options: {
            pagination: false,
            populate: [
                { 
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                { 
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    };

    console.log('Downloading SpaceX data');
    const response = await axios.post(SPACEX_API_URL, spaceXApiQuery);
    
    if(response.status !== 200) {
        console.log('Problem downloading SpaceX Launches');
        throw new Error('Launch data download failed!');
    }

    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {
        const payloads = launchDoc.payloads;
        const customers = payloads.flatMap((payload) => {return payload['customers']});

        const launch = {
            flightNumber: launchDoc.flight_number,
            mission: launchDoc.name,
            rocket: launchDoc.rocket.name,
            launchDate: new Date(launchDoc.date_local),
            customers: customers,
            upcoming: launchDoc.upcoming,
            success: launchDoc.success
        }

        console.log(`${launch.flightNumber} ${launch.rocket} ${launch.mission}`);

        await saveLaunch(launch);
    }
}

async function loadLaunchData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    });

    if(firstLaunch){
        console.log('launch data already loaded!');
    } else {
        populateDB();
    }
}

async function saveLaunch(launch){
    //using upsert again, like on planets
    await launches.updateOne({
        flightNumber: launch.flightNumber
    }, 
    launch, 
    {
        upsert :true
    });
}

async function getLatestFlightNumber() {
    const latestLaunch = await launches
        .findOne({})
        .sort('-flightNumber');

        if (!latestLaunch){
            return DEFAULT_FLIGHT_NUMBER;
        }
    return await latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
    // console.log(launches);
    // return Array.from(launches.values())
    return await launches
    .find(
        {},
        {
            '_id':0,
            '__v':0,
        })
    .sort({
        flightNumber: 1
    })
    .skip(skip)
    .limit(limit);
}

async function addNewLaunch(launch) {
    //latestFlightNumber++;

    //and checking if launch.target is actually a planet from planets collection
    const planet = await planets.findOne({keplerName : launch.target});
    if(!planet) {
        throw new Error(`No matching planet found with {'target':'${launch.target}'}!`);
    }

    await saveLaunch(
        Object.assign(launch, {
            flightNumber: await getLatestFlightNumber() + 1,
            upcoming: true,
            success: true,
            customers: ['ZTM', "NASA"],
       })
    );
    /*
    launches.set(
        latestFlightNumber, 
        Object.assign(launch, {
            flightNumber: latestFlightNumber,
            upcoming: true,
            success: true,
            customers: ['ZTM', "NASA"],
        })
    );
    */

}

async function findLaunch(filter) {
    return await launches.findOne(filter);
}

async function existsLaunchWithFlightNumber(flightNumber) {
    //console.log(flightNumber, launches.get(flightNumber));
    //return launches.has(flightNumber);
    return await findLaunch({flightNumber:flightNumber});
}

async function abortLaunchByFlightNumber(flightNumber) {
    /*
    const abortedLaunch = launches.get(flightNumber);
    abortedLaunch.upcoming = false;
    abortedLaunch.success = false;
    return abortedLaunch;
    */
   //findOneAndUpdate
   const aborted = await launches.updateOne(
    {
        flightNumber:flightNumber
    }, {
        upcoming: false,
        success: false,
    });

    return (aborted.acknowledged === true && aborted.modifiedCount === 1 && aborted.matchedCount === 1);
}

async function emptyLaunchesCollection() {
    await launches.deleteMany({});
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    existsLaunchWithFlightNumber,
    abortLaunchByFlightNumber,
    emptyLaunchesCollection,
    loadLaunchData,
}