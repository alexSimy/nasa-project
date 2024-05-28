const completeLaunchData = {
    mission: 'USS Enterprise',
    rocket: 'NNC 1701-D',
    target: 'Kepler-296 A f',
    launchDate: 'January 4, 2029',
};

const completeLaunchDataWithNumericalDate = {
    mission: 'USS Enterprise',
    rocket: 'NNC 1701-D',
    target: 'Kepler-296 A f',
    launchDate: 1862172000000,
}

const launchDataWithWrongTarget = {
    mission: 'USS Enterprise',
    rocket: 'NNC 1701-D',
    target: 'Kepler-186',
    launchDate: 1862172000000,
}

const launchDataWithoutDate = {
    mission: 'USS Enterprise',
    rocket: 'NNC 1701-D',
    target: 'Kepler-296 A f',
};

const launchDataWithInvalidDate = {
    mission: 'USS Enterprise',
    rocket: 'NNC 1701-D',
    target: 'Kepler-296 A f',
    launchDate: 'hello world',
};

const launchDataWithWrongFormat = {
    mission: 124,
    rocket: 'NNC 1701-D',
    target: 125,
    launchDate: 'hello world',
};

module.exports = {
    completeLaunchData,
    completeLaunchDataWithNumericalDate,
    launchDataWithWrongTarget,
    launchDataWithoutDate,
    launchDataWithInvalidDate,
    launchDataWithWrongFormat,
    
};