const knex = require('knex')
const app = require('../src/app')
const atob = require('atob')
const {makeFlyersArray, makeChildrenArray, makeAuthHeader, makeUsersArray} = require('./flyer.fixtures')


    let db
    const testUsers = makeUsersArray()
    const testChildren = makeChildrenArray()

    before('make knex instance', ()=>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db',db)
    })
    
    after('disconnect from db', ()=> db.destroy())
    
    before('clean the table', ()=>
    db.raw('TRUNCATE flyers, children, users RESTART IDENTITY CASCADE'))
    
    afterEach('cleanup', ()=>db.raw('TRUNCATE flyers, children, users RESTART IDENTITY CASCADE'))

    describe('GET /api/flyers', ()=>{
        context(`there is no data in the 'flyers' table`, ()=>{
            beforeEach(()=>{
                return db
                .into('users')
                .insert(testUsers)
            })

            it(`returns an empty array when there is no data in the database`, ()=>{
                const testUser = testUsers[0]
                return supertest(app)
                .get('/api/flyers')
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
                })
            })

            it(`returns the data in the database`, async ()=>{
                const testUser = testUsers[0]
                const expectedflyers = await makeFlyersArray().then((flyers)=>flyers.filter((flyer)=>flyer.parentuserid === testUser.userid))

                return supertest(app)
                .get('/api/flyers')
                .set('Authorization', makeAuthHeader({username: testUser.username, password: testUser.user_password}) )
                .expect(200)
                .then(response =>{
                    expect(response.body[0].title).to.eql(expectedflyers[0].title)
                    expect(response.body[0].location).to.eql(expectedflyers[0].eventlocation)
                    // expect(response.body[0].eventstartdate).to.eql(new Date(expectedflyers[0].eventstartdate))
                    // expect(response.body[0].eventenddate).to.eql(new Date(expectedflyers[0].eventenddate))
                    expect(response.body[0].action).to.eql(expectedflyers[0].flyeraction)
                    expect(response.body[0].category).to.eql(expectedflyers[0].flyercategory)
                    // expect(response.body[0].actiondate).to.eql(new Date(expectedflyers[0].actiondate))
                })

            })


    })





})