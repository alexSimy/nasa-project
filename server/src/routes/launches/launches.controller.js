const { 
    getAllLaunches,
    addNewLaunch,
    existsLaunchWithFlightNumber,
    abortLaunchByFlightNumber,
    } = require('../../models/launches.model');

const {
    getPagination
} = require('../../services/query');

async function httpGetAllLaunches(req, res) {
    const {skip, limit} = getPagination(req.query);
    const launches = await getAllLaunches(skip, limit);
    return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
    const data = req.body;
    if(!data.mission 
        || !data.rocket
        || !data.target
        || !data.launchDate) {

        return res.status(400).json({
            error:'Missing necessary launch fields!'
        });
    }

    if (typeof data.mission !== 'string' 
        || typeof data.rocket !== 'string' 
        || typeof data.target !== 'string') {
        return res.status(400).json({
            error:'Launch data not formated correctly!'
        });;
    }
    data.launchDate = new Date(data.launchDate);

    if (data.launchDate.toString() === 'Invalid Date' || isNaN(data.launchDate)) {
        return res.status(400).json({
            error:'Invalid launch date!'
        });
    }


    try{
        await addNewLaunch(data);
    } catch(err) {
        return res.status(400).json({
            error:`Invalid target planet!`
        });
    }


    //201 -> Created
    return res.status(201).json(data);
}

async function httpAbortLaunch(req, res) {
    const flightNumber = Number(req.params.flightNumber);

    if(!(await existsLaunchWithFlightNumber(flightNumber))){
        return res.status(400).json({
            error: 'Launch not found!'
        });
    }
    const abortedData = await abortLaunchByFlightNumber(flightNumber);
    if(!abortedData){
        return res.status(400).json({
            error: 'Launch not aborted!'
        });
    }
    return res.status(200).json({ok: true});
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}