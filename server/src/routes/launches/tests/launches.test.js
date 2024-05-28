const request = require('supertest');
const app = require('../../../app');
const {mongoConnect, mongoDisconnect} = require('../../../services/mongo');
const {loadPlanetsData, emptyPlanetsCollection} = require('../../../models/planets.model');
const {emptyLaunchesCollection} = require('../../../models/launches.model');
const {
    completeLaunchData,
    completeLaunchDataWithNumericalDate,
    launchDataWithWrongTarget,
    launchDataWithoutDate,
    launchDataWithInvalidDate,
    launchDataWithWrongFormat,
} = require('./test_data/launches_test_data');

/* jest --watch VS jest --watchAll
In package.json

"test-watch": "jest --watch" 
is not supported without git/hg
*/

describe('Launches API', ()=>{
    beforeAll(async () => {
        await mongoConnect(true);
        await loadPlanetsData();
    });

    afterAll(async () => {
        await emptyPlanetsCollection();
        await emptyLaunchesCollection();
        await mongoDisconnect(true);
    });

    describe('Test GET /launches',  () => {
        test('It should respond with 200 success', async () =>{
            const response = await request(app)
                .get('/v1/launches');
            expect(response.status).toBe(200);
        });
        test('It should respond with content type containing /json/ and 200 status code ', async () =>{
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type',/json/)
                .expect(200);
        });
    });
    describe('Test POST /launches', () => {
    
        test('It should respond with 200 success for string date', async() => {
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect('Content-Type',/json/)
                .expect(201);
            
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
    
            expect(responseDate).toBe(requestDate);
            expect(response.body).toMatchObject(launchDataWithoutDate);
        });

        test('It should respond with 200 success for numerical date', async() => {
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchDataWithNumericalDate)
                .expect('Content-Type',/json/)
                .expect(201);
    
            const requestDate = new Date(completeLaunchDataWithNumericalDate.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            console.log('It should respond with 200 success for numerical date', requestDate, responseDate);
    
            expect(requestDate).toBe(responseDate);
            expect(response.body).toMatchObject(launchDataWithoutDate);
    
            expect(response.body).toMatchObject(launchDataWithoutDate);
        });

        test('It should catch wrong planet', async() => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithWrongTarget)
                .expect('Content-Type',/json/)
                .expect(400);   
            
            expect(response.body).toStrictEqual(
            {
                error: 'Invalid target planet!'
            });
        });

        test('It should catch missing require properties', async() => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type',/json/)
                .expect(400);   
            
            expect(response.body).toStrictEqual(
            {
                error: 'Missing necessary launch fields!'
            });
        });
        
        test('It should catch invalid date', async() => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithInvalidDate)
                .expect('Content-Type',/json/)
                .expect(400);
            expect(response.body).toStrictEqual(
            {
                error: 'Invalid launch date!'
            });
        });
    
        test('It should catch data not formated correctly', async() => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithWrongFormat)
                .expect('Content-Type',/json/)
                .expect(400);
            expect(response.body).toStrictEqual(
            {
                error: 'Launch data not formated correctly!'
            });
        });
    });
});

