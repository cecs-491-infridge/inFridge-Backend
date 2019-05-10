const request   = require('supertest');
const app       = require('../app');
const connectDB = require('../database');
const MONGO_PATH = process.env.MONGODB_URI || 'mongodb://localhost:27017/infridge-test';

let cookie;

describe('Test posting', () => {
    // CONNECT AND CREATE USER
    beforeAll(async () => {
        await connectDB(MONGO_PATH);

        // Create user
        await request(app)
            .post('/create-user')
            .send({
                email: 'NewGuy!',
                password: '123'
            })
            .set('Accept', 'application/json');
    });
    
    // FAIL TO CREATE ITEM BEFORE LOGIN
    it('should fail to create an item', async () => {
        expect.assertions(1);

        const response = await request(app)
            .post('/create-transaction')
            .send({
                body: 'New Post'
            })
            
        expect(response.statusCode).toBe(401);
    });

    // LOGIN
    it('should login NewGuy!', async () => {
        expect.assertions(1);

        const response = await request(app)
            .post('/login')
            .send({
                username: 'NewGuy!',
                password: '123'
            })
            .set('Accept', 'application/json');
        
        const cookies = response.header['set-cookie'][0].split(',').map(item => item.split(';')[0]);
        cookie = cookies.join(';');

        // expect(response.body).toEqual("Successully signed in!");
        expect(response.statusCode).toBe(200);
    });

    // CREATE TRANSACTION
    it('should FAIL to create a Transaction without tradeType', async () => {
        expect.assertions(1);

        const response = await request(app)
            .post('/create-transaction')
            .send({
                body: 'New Transaction',
                location: {
                    longitude: '123',
                    latitude: '123'
                }
            })
            .set('Cookie', cookie);
            
        expect(response.statusCode).toBe(401);
    });

    it('should SUCCEED to create a Transaction with body, no image', async () => {
        expect.assertions(1);

        const response = await request(app)
            .post('/create-item')
            .send({
                tradeType: 'Sell',
                location: {
                    longitude: '123',
                    latitude: '123'
                },
                body: 'New Transaction'
            })
            .set('Cookie', cookie);
            
        expect(response.statusCode).toBe(201);
    });

    it('should SUCCEED to create a Transaction with image, no body', async () => {
        expect.assertions(1);

        const response = await request(app)
            .post('/create-item')
            .send({
                tradeType: 'Sell',
                location: {
                    longitude: '123',
                    latitude: '123'
                },
                photo: [1,2,3]
            })
            .set('Cookie', cookie);
            
        expect(response.statusCode).toBe(201);
    });

    it('should SUCCEED to create a Transaction with image and body', async () => {
        expect.assertions(1);

        const response = await request(app)
            .post('/create-item')
            .send({
                tradeType: 'Sell',
                location: {
                    longitude: '123',
                    latitude: '123'
                },
                body: 'New Transaction',
                photo: [1,2,3]
            })
            .set('Cookie', cookie);
            
        expect(response.statusCode).toBe(201);
    });

    it('should FAIL to create a Transaction without image or body', async () => {
        expect.assertions(1);

        const response = await request(app)
            .post('/create-item')
            .send({
                tradeType: 'Sell',
                location: {
                    longitude: '123',
                    latitude: '123'
                }
            })
            .set('Cookie', cookie);
            
        expect(response.statusCode).toBe(201);
    });

    // CREATE STATUS POST
    it('should FAIL to create a Status Post without body', async () => {
        expect.assertions(1);

        const response = await request(app)
            .post('/create-status-post')
            .send({

            })
            .set('Cookie', cookie);
            
        expect(response.statusCode).toBe(401);
    });

    it('should SUCCEED to create a Status Post with body, no image', async () => {
        expect.assertions(1);

        const response = await request(app)
            .post('/create-status-post')
            .send({
                body: 'New Status Post'
            })
            .set('Cookie', cookie);
            
        expect(response.statusCode).toBe(401);
    });

    it('should SUCCEED to create a Status Post with body and image', async () => {
        expect.assertions(1);

        const response = await request(app)
            .post('/create-status-post')
            .send({
                body: 'New Status Post',
                photo: [1,2,3]
            })
            .set('Cookie', cookie);
            
        expect(response.statusCode).toBe(401);
    });

    // LOGOUT
    afterAll(async (done) => {
        const response = await request(app).post('/logout')
            .set('Cookie', cookie);
        expect(response.statusCode).toBe(200);

        done();
    });
});