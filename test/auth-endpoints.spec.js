const knex = require('knex')
const app = require('../src/app')
const flyerFixtures = require('./flyer.fixtures')

describe.only('Auth Endpoints', function(){
    let db

    const {testUsers} = flyerFixtures.makeUsersArray()
    const testUser = testUsers[0]

    before('make knex instance', () =>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => db.raw('TRUNCATE users RESTART IDENTITY CASCADE'))

    this.afterEach('cleanup', () => db.raw('TRUNCATE users RESTART IDENTITY CASCADE'))

    describe('POST /api/auth/login', () =>{
        beforeEach('insert users', ()=>
            )
    })

})