const knex = require('knex')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const flyerFixtures= require('./flyer.fixtures')
const bcrypt = require('bcryptjs')

describe('Auth Endpoints', function(){
    let db

    const testUsers = flyerFixtures.makeUsersArray()
    const testUser = testUsers[0]

    before('make knex instance', () =>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => db.raw('TRUNCATE users RESTART IDENTITY CASCADE'))

    this.afterEach('cleanup', () => db.raw('TRUNCATE users RESTART IDENTITY CASCADE'))

    describe('POST /api/auth/login', () =>{
        const preppedUsers = testUsers.map(user=>({...user,user_password: bcrypt.hashSync(user.user_password,1)}))
        beforeEach('insert users', ()=>
           db.insert(preppedUsers)
           .into('users')
            )

            const requiredFields = ['username', 'user_password']

            requiredFields.forEach(field => {
                const loginAttemptBody = {
                    username: testUser.username,
                    user_password: testUser.user_password,
                }

                it(`responds with 400 required error when ${field} is missing`, ()=>{
                    delete loginAttemptBody[field]

                    return supertest(app)
                    .post('/api/auth/login')
                    .send(loginAttemptBody)
                    .expect(400,{
                        error: `Missing ${field} in request body`,
                    })
                })
            })

            it(`responds 400 'invalide username or password' when bad username`, ()=>{
                const userInvalidUser = {username: 'user-not', user_password: 'existy'}
                return supertest(app)
                .post('/api/auth/login')
                .send(userInvalidUser)
                .expect(400, {error: `Incorrect username or password`})
            })
            it(`responds 400 'invalide username or password' when bad password`, ()=>{
                const userInvalidPass = {username: testUser.username, user_password: 'incorrect'}
                return supertest(app)
                .post('/api/auth/login')
                .send(userInvalidPass)
                .expect(400, {error: `Incorrect username or password`})
            })

            it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
                const userValidCreds = {
                    username: testUser.username,
                    user_password: testUser.user_password,
                }
                
                const expectedToken = jwt.sign(
                    {userid: 1},
                    process.env.JWT_SECRET,
                    {
                        subject: testUser.username,
                        algorithm: 'HS256',
                    })
                return supertest(app)
                    .post('/api/auth/login')
                    .send(userValidCreds)
                    .expect(200, {
                        authToken: expectedToken,
                    })
                
            })
    })

})