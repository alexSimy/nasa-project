const {parse} = require('csv-parse');
const fs = require('node:fs');
const path = require('path');

const planets = require('./planets.mongo');

// const habitablePlanets = [];

const isHabitablePlanet = (planet) => {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
};

async function savePlanets(planet) {
    try{
        // insert + update = upsert
        // updates only when first object is not found
        // updates with the second object
        // upsert: true => add if not exists                
        await planets.updateOne({
            keplerName: planet.kepler_name,
        }, {
            keplerName: planet.kepler_name,
        }, {
            upsert: true,
        });

        //insert
        /*
        await planets.create({
            keplerName: data.kepler_name,
        });
        */
    } catch(err) {
        console.log(`Could not save planet ${err}`);
    }
}

async function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
        .pipe(parse({
            comment: '#',
            columns: true
        }))
        .on('data', async (data)=> {
            if (isHabitablePlanet(data)){
                //habitablePlanets.push(data);

                await savePlanets(data);
            }
        })
        .on('error', (err)=> {
            console.log(err);
            reject(err);
        })
        .on('end', async () => {
            const countPlanetsFound = (await getAllPlanets()).length;
            console.log(`${countPlanetsFound} planets found!`)
            resolve();
        });
    });
};

async function getAllPlanets() {
    // return habitablePlanets;
    // first obj is criteria
    // second obj is select options
    return await planets.find({}, {
        '_id': 0,
        '__v': 0,
    });
}

async function emptyPlanetsCollection() {
    await planets.deleteMany({});
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
    emptyPlanetsCollection,
};