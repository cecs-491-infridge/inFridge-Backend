const request   = require('supertest');
const app       = require('../app');
const connectDB = require('../database');
const MONGO_PATH = process.env.MONGODB_URI || 'mongodb://localhost:27017/infridge-test';

describe('Test api', () => {
    
    // Fail to get recipe
    it('should fail to search recipe', async () => {
        expect.assertions(1);

        const response = await request(app)
            .post('/search-recipe')
            .send({
                search: 'asdfghijklmnopj'
            })
            
        expect(response.statusCode).toBe(404);
    });

    // success to search recipe
    it('should search recipe', async () => {
        expect.assertions(1);

        const response = await request(app)
            .post('/search-recipe')
            .send({
                search: 'apple pie'
            })
            
        expect(response.statusCode).toBe(200);
    });

    //Gets a recipe according to fridge
    it('should get a recipe', async () => {
        expect.assertions(1);

        const response = await request(app)
            .post('/get-recipe')
            .send({
                id: 'H7A78S9D9GASGRERZBJ9A'
            })
            
        expect(response.statusCode).toBe(200);
    });

});
