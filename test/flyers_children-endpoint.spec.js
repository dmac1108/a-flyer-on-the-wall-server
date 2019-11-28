const knex = require('knex')
const app = require('../src/app')
const {makeFlyersChildrenArray, makeFlyersArray, makeChildrenArray, makeAuthHeader, makeUsersArray} = require('./flyer.fixtures')

let db
    const testUsers = makeUsersArray()
    const testChildren = makeChildrenArray()
    const testFlyersChildren = makeFlyersChildrenArray()

    before('make knex instance', ()=>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db',db)
    })
    
   after('disconnect from db', ()=> db.destroy())
    
    before('clean the table', ()=>
    db.raw('TRUNCATE flyers_children, flyers, children, users RESTART IDENTITY CASCADE'))
    
    afterEach('cleanup', ()=>db.raw('TRUNCATE flyers_children, flyers, children, users RESTART IDENTITY CASCADE'))

describe.only(`GET /api/flyers_children`, ()=>{
        context('there is no data in the database', ()=>{
            beforeEach(()=>{
                return db
                .into('users')
                .insert(testUsers)
            })

            it(`returns 200 and empty array`, ()=>{
                const testUser = testUsers[0]
                return supertest(app)
                .get('/api/flyers_children')
                .set('Authorization', makeAuthHeader({username: testUser.username, password: testUser.user_password}) )
                .expect(200, [])
            
        })
    })
    context(`there is data in the database`, ()=>{
        beforeEach(()=>{
            return db.into('users')
            .insert(testUsers)
            .then(()=>{
                return db.into('children')
                .insert(testChildren)
                })
            })

        beforeEach(async function(){
            await makeFlyersArray()
            .then((flyers)=>{
                return db.into('flyers')
                .insert(flyers)
                .then(()=>{
                    return db
                    .into('flyers_children')
                    .insert(testFlyersChildren)
                })
            })
            
        })
    })
})
