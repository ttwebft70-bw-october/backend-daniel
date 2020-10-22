require('dotenv').config();
const mongoose = require('mongoose');
const supertest = require('supertest');
const server = require('./server');
const jwt = require('jsonwebtoken');

const User = require('./db/models/user');

describe('server.js', () => {
    describe('GET /', () => {
        it('should connect to server responding w/ 200', (done) => {
            return supertest(server)
            .get('/')
            .then(res => {
                expect(res.status).toBe(200);
                done();
            })
            .catch(err => {
                console.log(err);
            })
        });
    });

    describe('/api/users', () => {
        mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        describe('POST /register', () => {
            let token;
            afterEach(async () => {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                await User.findByIdAndDelete(decoded._id)
            });
            it('should create a new user', async () => {
                return await supertest(server)
                .post('/api/users/register')
                .send({ username: "jest", email: "jest@jest.com", password: "jestjest" })
                .set("Accept", "application/json")
                .then(res => {
                    token = res.body.token;
                    expect(res.status).toBe(201);
                })
                .catch(err => {
                    console.log(err);
                })
            });

            it('should not create a user if missing field', async () => {
                return await supertest(server)
                .post('/api/users/register')
                .send({ username: "jest", email: "jest@jest.com" })
                .set('Accept', 'application/json')
                .then(res => {
                    expect(res.body[0].message).toContain('required');
                })
                .catch(err => {
                    console.log(err);
                });
            });

            it('should not create a user if password is less than 6 characters', async () => {
                return await supertest(server)
                .post('/api/users/register')
                .send({ username: "jestjest", email: "jest@jest.com", password: "jest" })
                .set('Accept', 'application/json')
                .then(res => {
                    expect(res.status).toBe(400);
                    expect(res.body[0].message).toContain('characters');
                });
            });
        });

        // describe('POST /login', () => {

        // })
    });
});