const knex = require('knex')
const app = require('../src/app')
const {makeFlyersChildrenArray, makeFlyersArray, makeChildrenArray, makeAuthHeader, makeUsersArray} = require('./flyer.fixtures')

describe(`Flyers_Children Enpoint`, ()=>{
let db
    const testUsers = makeUsersArray()
    const testChildren = makeChildrenArray()
    const testFlyersChildren = makeFlyersChildrenArray()
    

    before('make knex instance', ()=>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db',db)
    })
    
    after('disconnect from db', ()=> db.destroy())
    
    beforeEach('clean the table', ()=>
    db.raw('TRUNCATE flyers_children, flyers, children, users RESTART IDENTITY CASCADE'))
    
    afterEach('cleanup', ()=>db.raw('TRUNCATE flyers_children, flyers, children, users RESTART IDENTITY CASCADE'))

describe(`GET /api/flyers_children`, ()=>{
        context('there is no data in the database', ()=>{
            beforeEach(()=>{
                return db
                .into('users')
                .insert(testUsers)
            })
            afterEach('cleanup', ()=>db.raw('TRUNCATE flyers_children, flyers, children, users RESTART IDENTITY CASCADE'))

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

        afterEach('cleanup', ()=>db.raw('TRUNCATE flyers_children, flyers, children, users RESTART IDENTITY CASCADE'))

        it(`returns 200 and the array of flyers_children`, ()=>{
            const testUser = testUsers[0]
            return supertest(app)
            .get('/api/flyers_children')
            .set('Authorization', makeAuthHeader({username: testUser.username, password: testUser.user_password}) )
            .expect(200, testFlyersChildren)
        
    })
    })
})

describe(`POST /api/flyers_children`, ()=>{
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
        })
        
    })

    afterEach('cleanup', ()=>db.raw('TRUNCATE flyers_children, flyers, children, users RESTART IDENTITY CASCADE'))

    it(`returns 404 and error message if incorrect childid`, ()=>{
        const testUser = testUsers[0]
        const testFlyerChild = [{
            id: 1, 
            flyerid: 3,
            childid: 23490
        }]
        return supertest(app)
        .post('/api/flyers_children')
        .set('Authorization', makeAuthHeader({username: testUser.username, password: testUser.user_password}) )
        .send(testFlyerChild)
        .expect(404, {
            error: {
                message: `Child not found`
            }
        })
        
    })

    it(`returns 404 and error message if incorrect flyerid`, ()=>{
        const testUser = testUsers[0]
        const testFlyerChild = [{
            id: 1, 
            flyerid: 323423,
            childid: 1
        }]
        return supertest(app)
        .post('/api/flyers_children')
        .set('Authorization', makeAuthHeader({username: testUser.username, password: testUser.user_password}) )
        .send(testFlyerChild)
        .expect(404, {
            error: {
                message: `Flyer not found`
            }
        })
        
    })


    it(`returns 200 and inserts new flyers_children`, ()=>{
        const testUser = testUsers[0]
        testFlyerChild = [{
            id: 1, 
            childid: 2,
            flyerid: 3
        }]
        return supertest(app)
        .post('/api/flyers_children')
        .set('Authorization', makeAuthHeader({username: testUser.username, password: testUser.user_password}) )
        .send(testFlyerChild)
        .then((response)=>{
            expect(response.body).to.eql(testFlyerChild)
        })

    })


})
})
