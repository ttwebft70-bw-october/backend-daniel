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
            afterAll(async () => {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                await User.findByIdAndDelete(decoded._id);
                console.log("♻ USER DELETED ♻", '/register');
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

        describe('POST /login', () => {
            let token;
            beforeAll(async () => {
                return await supertest(server)
                .post('/api/users/register')
                .send({ username: "jest", email: "jest@jest.com", password: "jestjest" })
                .set('Accept', 'application/json');
            });

            afterAll(async () => {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                await User.findByIdAndDelete(decoded._id);
                return console.log("♻ USER DELETED ♻", '/login');
            });

            it('can successfully login, returns a token', async () => {
                return supertest(server)
                .post('/api/users/login')
                .send({ username: "jest", password: "jestjest" })
                .set('Accept', 'application/json')
                .then(res => {
                    token = res.body.token;
                    expect(Object.keys(res.body)[0]).toBe('token');
                    expect(res.status).toBe(202);
                });
            });

            it('will respond with 400 on unsuccessful authentication.', () => {
                return supertest(server)
                .post('/api/users/login')
                .send({ username: "jest", password: "jestjestjest" })
                .set('Accept', 'application/json')
                .then(res => {
                    expect(res.body.message).toBe('Invalid user info.');
                    expect(res.status).toBe(400);
                });
            });
        });

        describe('GET /', () => {
            let token;
            beforeAll(() => {
                return supertest(server)
                .post('/api/users/register')
                .send({ username: "jest", email: "jest@jest.com", password: "jestjest" })
                .set('Accept', 'application/json')
                .then(res => {
                    token = res.body.token;
                })
                .catch(err => {
                    console.log(err);
                });
            });

            afterAll(async () => {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                await User.findByIdAndDelete(decoded._id);
                return console.log("♻ USER DELETED ♻", 'GET /');
            });

            it('can access list of users responding with 200', () => {
                return supertest(server)
                .get('/api/users')
                .set('Authorization', token)
                .then(res => {
                    expect(res.status).toBe(200);
                });
            });

            it('will deny access to list if no valid token provided responding with 401', () => {
                return supertest(server)
                .get('/api/users')
                .then(res => {
                    expect(res.status).toBe(401);
                });
            })
        });

        describe('/:id', () => {
            let token;
            let decoded;
            beforeAll(() => {
                return supertest(server)
                .post('/api/users/register')
                .send({ username: "jest", email: "jest@jest.com", password: "jestjest" })
                .set('Accept', 'application/json')
                .then(res => {
                    token = res.body.token;
                    decoded = jwt.verify(token, process.env.JWT_SECRET);
                })
                .catch(err => {
                    console.log(err);
                });
            });

            it('can GET an individual user', () => {
                return supertest(server)
                .get(`/api/users/${decoded._id}`)
                .set('Authorization', token)
                .then(res => {
                    expect(res.body.username).toBe('jest');
                    expect(res.status).toBe(200);
                })
            });

            it('can GET a list of what a user is selling returning 200', () => {
                return supertest(server)
                .get(`/api/users/${decoded._id}/products`)
                .set('Authorization', token)
                .then(res => {
                    expect(res.status).toBe(200);
                })
            });

            it('can PUT/update a user responding with 202', () => {
                return supertest(server)
                .put(`/api/users/${decoded._id}`)
                .send({ password: 'jestjestjest' })
                .set('Authorization', token)
                .then(res => {
                    expect(res.status).toBe(202);
                })
                .catch(err => {
                    console.log(err);
                });
            });

            it('will return a 404 if no user with provided ID', () => {
                let badId = '5f8ec4474dd1b63ec48d8c4t'
                return supertest(server)
                .get(`/api/users/${badId}`)
                .set('Authorization', token)
                .then(res => {
                    expect(res.status).toBe(404);
                })
                .catch(err => {
                    console.log(err);
                });
            });

            it('will return a 401 if no user with provided ID on PUT request', () => {
                let badId = '5f8ec4474dd1b63ec48d8c4t';
                return supertest(server)
                .put(`/api/users/${badId}`)
                .set('Authorization', token)
                .then(res => {
                    expect(res.status).toBe(401);
                })
                .catch(err => {
                    console.log(err);
                });
            });

            it('will return a 401 if no user with provided ID on DELETE request', () => {
                let badId = '5f8ec4474dd1b63ec48d8c4t';
                return supertest(server)
                .delete(`/api/users/${badId}`)
                .set('Authorization', token)
                .then(res => {
                    expect(res.status).toBe(401);
                })
                .catch(err => {
                    console.log(err);
                });
            });

            it('can DELETE user responding with 202', () => {
                return supertest(server)
                .delete(`/api/users/${decoded._id}`)
                .set('Authorization', token)
                .then(res => {
                    expect(res.status).toBe(202);
                })
                .catch(err => {
                    console.log(err);
                });
            });
        });
    });

    describe('/api/products', () => {
        let token;
        let decoded;
        let jestItem;

        beforeAll(() => {
            return supertest(server)
            .post('/api/users/register')
            .send({ username: "jest", email: "jest@jest.com", password: "jestjest" })
            .then(res => {
                token = res.body.token;
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            })
            .catch(err => {
                console.log(err);
            });
        });

        afterAll(async () => {
            await User.findByIdAndDelete(decoded._id);
            return console.log("♻ USER DELETED ♻", '/api/products');
        });

        describe('GET /', () => {
            it('can get a list of all products returning 200', () => {
                return supertest(server)
                .get('/api/products')
                .set('Authorization', token)
                .then(res => {
                    expect(res.status).toBe(200);
                });
            });

            it('will return 401 if user not logged in', () => {
                return supertest(server)
                .get('/api/products')
                .then(res => {
                    expect(res.status).toBe(401);
                })
            });
        });

        describe('POST /', () => {
            it('will return 201 if user successfully created a post', () => {
                return supertest(server)
                .post('/api/products')
                .send({ name: "jest-item", price: 0 })
                .set('Authorization', token)
                .set('Accept', 'application/json')
                .then(res => {
                    jestItem = res.body;
                    console.log('jestItem:', jestItem);
                    expect(res.status).toBe(201);
                })
            });

            it('will return 400 if missing required fields', () => {
                return supertest(server)
                .post('/api/products')
                .send({ name: "jest-item" })
                .set('Authorization', token)
                .set('Accept', 'application/json')
                .then(res => {
                    expect(res.status).toBe(400);
                });
            });
        });

        describe('GET /:id', () => {
            it('can get info on a single product returning 200', () => {
                return supertest(server)
                .get(`/api/products/${jestItem._id}`)
                .set('Authorization', token)
                .then(res => {
                    expect(res.status).toBe(200);
                });
            });

            it('will return 401 if user is not signed in.', () => {
                return supertest(server)
                .get(`/api/products/${jestItem._id}`)
                .then(res => {
                    expect(res.status).toBe(401);
                })
            });
        });

        describe('PUT /:id', () => {
            it("will return 202 if product info updated successfully", () => {
                return supertest(server)
                .put(`/api/products/${jestItem._id}`)
                .send({ price: 1.50 })
                .set('Authorization', token)
                .set('Accept', 'application/json')
                .then(res => {
                    console.log(res.body);
                    expect(res.status).toBe(202);
                });
            });

            it("will return 401 if trying to modify an existing user's product info", () => {
                return supertest(server)
                .put(`/api/products/5f90f96fe821b6669cd77db1`)
                .send({ price: 1.50 })
                .set('Authorization', token)
                .set('Accept', 'application/json')
                .then(res => {
                    console.log(res.body);
                    expect(res.status).toBe(401);
                });
            });

            it('will return 404 if no product is found with specified id', () => {
                let badId = '5f90e76b2d646166d07da176';
                return supertest(server)
                .put(`/api/products/${badId}`)
                .send({ price: 1.50 })
                .set('Authorization', token)
                .set('Accept', 'application/json')
                .then(res => {
                    expect(res.status).toBe(404);
                });
            });
        });

        describe('DELETE /:id', () => {
            it('will return 404 if product not found', () => {
                let badId = '5f90e76b2d646166d07da176';
                return supertest(server)
                .delete(`/api/products/${badId}`)
                .send({ price: 1.50 })
                .set('Authorization', token)
                .set('Accept', 'application/json')
                .then(res => {
                    expect(res.status).toBe(404);
                });
            });

            it("will return 202 if product info updated successfully", () => {
                return supertest(server)
                .delete(`/api/products/${jestItem._id}`)
                .set('Authorization', token)
                .then(res => {
                    expect(res.status).toBe(202);
                });
            });
        });
    });
});