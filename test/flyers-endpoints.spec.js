const knex = require('knex')
const app = require('../src/app')
const {makeFlyersArray, makeChildrenArray, makeAuthHeader, makeUsersArray} = require('./flyer.fixtures')
const atob = require('atob')

describe(`Flyers Endpoint`, ()=>{


    let db
    const testUsers = makeUsersArray()
    const testChildren = makeChildrenArray()

    before('make knex instance', ()=>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
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
                    expect(new Date(response.body[0].eventstartdate).toLocaleString()).to.eql(new Date(expectedflyers[0].eventstartdate).toLocaleString())
                    expect(new Date(response.body[0].eventenddate).toLocaleString()).to.eql(new Date(expectedflyers[0].eventenddate).toLocaleString())
                    expect(response.body[0].action).to.eql(expectedflyers[0].flyeraction)
                    expect(response.body[0].category).to.eql(expectedflyers[0].flyercategory)
                    expect(new Date(response.body[0].actiondate).toLocaleString()).to.eql(new Date(expectedflyers[0].actiondate).toLocaleString())
                })

            })


    })

})

describe(`POST /api/flyer`, ()=>{
    beforeEach(()=>{
        return db.into('users')
        .insert(testUsers)
        .then(()=>{
            return db.into('children')
            .insert(testChildren)
            })
        })
    
    it(`returns Missing the key in the request body when missing key`, async ()=>{
        const testUser = testUsers[0]
        const testFlyers = await makeFlyersArray().then((flyers)=>flyers.filter((flyer)=>flyer.parentuserid === 1))
        const flyerToInsert = testFlyers[0]
        delete flyerToInsert.title
        return supertest(app)
        .post('/api/flyers')
        .set('Authorization', makeAuthHeader({username: testUser.username, password: testUser.user_password}) )
        .send(flyerToInsert)
        .expect(400,{error: {message: `Missing the title in the request body`}})
    })
        

    it(`inserts new flyer into the database`, async ()=>{
        const testUser = testUsers[0]
        const testFlyers = await makeFlyersArray().then((flyers)=>flyers.filter((flyer)=>flyer.parentuserid === 1))
        const flyerToInsert = testFlyers[0]
    
        return supertest(app)
        .post('/api/flyers')
        .set('Authorization', makeAuthHeader({username: testUser.username, password: testUser.user_password}) )
        .send(flyerToInsert)
        .then((response)=>{
            expect(response.body.title).to.eql(flyerToInsert.title)
            expect(response.body.location).to.eql(flyerToInsert.eventlocation)
            expect(new Date(response.body.eventstartdate).toLocaleString()).to.eql(new Date(flyerToInsert.eventstartdate).toLocaleString())
            expect(new Date(response.body.eventenddate).toLocaleString()).to.eql(new Date(flyerToInsert.eventenddate).toLocaleString())
            expect(response.body.action).to.eql(flyerToInsert.flyeraction)
            expect(new Date(response.body.actiondate).toLocaleString()).to.eql(new Date(flyerToInsert.actiondate).toLocaleString())
            expect(response.body.category).to.eql(flyerToInsert.flyercategory)
            expect(response.body.image).to.eql(flyerToInsert.flyerimage)
        })

    })
})

describe('GET /api/flyers/:id', ()=>{
    context(`there is no data in the 'flyers' table`, ()=>{
        beforeEach(()=>{
            return db
            .into('users')
            .insert(testUsers)
        })

        it(`returns 404 and Flyer does not exist error message when no flyer found`, ()=>{
            const testUser = testUsers[0]
            const badTestFlyerId = '25342'
            return supertest(app)
            .get(`/api/flyers/${badTestFlyerId}`)
            .set('Authorization', makeAuthHeader({username: testUser.username, password: testUser.user_password}) )
            .expect(404, {error: {message: 'Flyer does not exist'}})

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

        it(`returns the requested flyer in the database`, async ()=>{
            const testUser = testUsers[0]
            const expectedflyers = await makeFlyersArray().then((flyers)=>flyers.filter((flyer)=>flyer.parentuserid === testUser.userid))
            const testFlyer = expectedflyers[0]

            return supertest(app)
            .get(`/api/flyers/${testFlyer.id}`)
            .set('Authorization', makeAuthHeader({username: testUser.username, password: testUser.user_password}) )
            .expect(200)
            .then(response =>{
                expect(response.body.title).to.eql(testFlyer.title)
                expect(response.body.location).to.eql(testFlyer.eventlocation)
                expect(new Date(response.body.eventstartdate).toLocaleString()).to.eql(new Date(testFlyer.eventstartdate).toLocaleString())
                expect(new Date(response.body.eventenddate).toLocaleString()).to.eql(new Date(testFlyer.eventenddate).toLocaleString())
                expect(response.body.action).to.eql(testFlyer.flyeraction)
                expect(response.body.category).to.eql(testFlyer.flyercategory)
                expect(new Date(response.body.actiondate).toLocaleString()).to.eql(new Date(testFlyer.actiondate).toLocaleString())
            })

        })


})

})

describe('DELETE /api/flyers/:id', ()=>{
    context(`there is no data in the 'flyers' table`, ()=>{
        beforeEach(()=>{
            return db
            .into('users')
            .insert(testUsers)
        })

        it(`returns 404 and Flyer does not exist error message when no flyer found`, ()=>{
            const testUser = testUsers[0]
            const badTestFlyerId = '25342'
            return supertest(app)
            .delete(`/api/flyers/${badTestFlyerId}`)
            .set('Authorization', makeAuthHeader({username: testUser.username, password: testUser.user_password}) )
            .expect(404, {error: {message: 'Flyer does not exist'}})

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

        it(`removes the requested flyer from the database`, async ()=>{
            const testUser = testUsers[0]
            const userFlyers = await makeFlyersArray().then((flyers)=>flyers.filter((flyer)=>flyer.parentuserid === testUser.userid))
            const flyerToDelete = userFlyers[0]
            const expectedflyers = userFlyers.filter((flyer)=>flyer.id !== flyerToDelete.id)
            return supertest(app)
            .delete(`/api/flyers/${flyerToDelete.id}`)
            .set('Authorization', makeAuthHeader({username: testUser.username, password: testUser.user_password}) )
            .expect(204)
            .then(()=>{
                return supertest(app)
                .get('/api/flyers')
                .set('Authorization', makeAuthHeader({username: testUser.username, password: testUser.user_password}) )
                .expect(200)
                .then((response)=>{
                    expect(response.body.title).to.eql(expectedflyers.title)
                    expect(response.body.location).to.eql(expectedflyers.eventlocation)
                    expect(new Date(response.body.eventstartdate).toLocaleString()).to.eql(new Date(expectedflyers.eventstartdate).toLocaleString())
                    expect(new Date(response.body.eventenddate).toLocaleString()).to.eql(new Date(expectedflyers.eventenddate).toLocaleString())
                    expect(response.body.action).to.eql(expectedflyers.flyeraction)
                    expect(response.body.category).to.eql(expectedflyers.flyercategory)
                    expect(new Date(response.body.actiondate).toLocaleString()).to.eql(new Date(expectedflyers.actiondate).toLocaleString())
                })
                
            })

        })


})
})

describe.only(`PATCH /api/flyer/:id`, ()=>{
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

    
    it(`returns 404 and Flyer does not exist error message when no flyer found`, ()=>{
        const testUser = testUsers[0]
        const badTestFlyerId = '25342'
        return supertest(app)
        .patch(`/api/flyers/${badTestFlyerId}`)
        .set('Authorization', makeAuthHeader({username: testUser.username, password: testUser.user_password}) )
        .expect(404, {error: {message: 'Flyer does not exist'}})

    })
        

    it(`updates flyer into the database`, async ()=>{
        const testUser = testUsers[0]
        const testFlyers = await makeFlyersArray().then((flyers)=>flyers.filter((flyer)=>flyer.parentuserid === testUsers[0].userid))
        const flyerToUpdate = testFlyers[0]
        flyerToUpdate.title = 'New Flyer Title'
        
        return supertest(app)
        .patch(`/api/flyers/${flyerToUpdate.id}`)
        .set('Authorization', makeAuthHeader({username: testUser.username, password: testUser.user_password}) )
        .send(flyerToUpdate)
        .expect(200)
        .then((response) =>{
                    expect(response.body.title).to.eql(flyerToUpdate.title)
                    expect(response.body.location).to.eql(flyerToUpdate.eventlocation)
                    expect(new Date(response.body.eventstartdate).toLocaleString()).to.eql(new Date(flyerToUpdate.eventstartdate).toLocaleString())
                    expect(new Date(response.body.eventenddate).toLocaleString()).to.eql(new Date(flyerToUpdate.eventenddate).toLocaleString())
                    expect(response.body.action).to.eql(flyerToUpdate.flyeraction)
                    expect(response.body.category).to.eql(flyerToUpdate.flyercategory)
                    expect(new Date(response.body.actiondate).toLocaleString()).to.eql(new Date(flyerToUpdate.actiondate).toLocaleString())
        })
        

    })
})
})