const FlyersService = require('../src/Flyers/Flyers-Service')
const atob = require('atob')
const knex = require('knex')
const {makeUsersArray, makeChildrenArray, makeFlyersNoImagesArray, makeFlyersArray} = require('./flyer.fixtures')

describe(`FlyersService`, function(){
    
    let db

    before(() =>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
    })

    const testUsers = makeUsersArray()
    const children = makeChildrenArray()
    

    after(() => db.destroy())

    before('clean the table', () => db.raw('TRUNCATE flyers, children, users RESTART IDENTITY CASCADE'))

    afterEach('clean the table', () => db.raw('TRUNCATE flyers, children, users RESTART IDENTITY CASCADE'))

    context(`there is no data in the 'flyers' table`, ()=>{
        beforeEach(()=>{
            return db
            .into('users')
            .insert(testUsers)
            .then(()=>{
                return db.into('children')
                .insert(children)
                
                })
        })

        it(`getAllFlyers returns an empty array`, ()=>{
            const parentUserId = 1
            return FlyersService.getAllFlyers(db, parentUserId)
            .then(actual=>{
                expect(actual).to.eql([])
            })
            
        })

        it(`insertFlyer inserts a new flyer and returns it`, async ()=>{
            const testFlyers = await makeFlyersArray().then((flyers)=>flyers.filter((flyer)=>flyer.parentuserid === 1))
            const flyerToInsert = testFlyers[0]
            
            return FlyersService.insertFlyer(db,flyerToInsert)
            .then(actual =>{
                expect(actual.title).to.eql(flyerToInsert.title)
                expect(actual.flyeraction).to.eql(flyerToInsert.flyeraction)
                expect(actual.actiondate).to.eql(new Date(flyerToInsert.actiondate))
                expect(actual.eventlocation).to.eql(flyerToInsert.eventlocation)
                expect(actual.eventstartdate).to.eql(new Date(flyerToInsert.eventstartdate))
                expect(actual.eventenddate).to.eql(new Date(flyerToInsert.eventenddate))
                expect(actual.category).to.eql(flyerToInsert.category)
                expect(atob(actual.flyerimage)).to.eql(flyerToInsert.flyerimage)
            })
        })
    })

    context(`there is data in the 'flyers' table`, ()=>{
        const flyersArrayNoImages = makeFlyersNoImagesArray();
        

        beforeEach(()=>{
            return db.into('users')
            .insert(testUsers)
            .then(()=>{
                return db.into('children')
                .insert(children)
                
                })
                
            })

        beforeEach(async function(){
            await makeFlyersArray()
            .then((flyers)=>{
                return db.into('flyers')
                .insert(flyers)
            })
        })
  
        afterEach('clean the table', () => db.raw('TRUNCATE flyers, children, users RESTART IDENTITY CASCADE'))   
 
        it(`getAllFlyers returns all flyers in the 'flyers' table`, async ()=>{
            const parentUserId = 1
            const expectedFlyersParentId1 = await makeFlyersArray().then((flyers)=>flyers.filter((flyer)=>flyer.parentuserid === parentUserId))
            
            return FlyersService.getAllFlyers(db, parentUserId)
            .then(actual =>{
                expect(actual.title).to.eql(expectedFlyersParentId1.title)
                expect(actual.flyeraction).to.eql(expectedFlyersParentId1.flyeraction)
                expect(actual.actiondate).to.eql(expectedFlyersParentId1.actiondate)
                expect(actual.eventlocation).to.eql(expectedFlyersParentId1.eventlocation)
                expect(actual.eventstartdate).to.eql(expectedFlyersParentId1.eventstartdate)
                expect(actual.eventenddate).to.eql(expectedFlyersParentId1.eventenddate)
                expect(actual.category).to.eql(expectedFlyersParentId1.category)
                expect(actual.flyerimage).to.eql(expectedFlyersParentId1.flyerimage)
                
            })
        })

        it(`getFlyerbyId returns the flyer`, async ()=>{
            
            const parentUserId = 1
            const flyersArray = await makeFlyersArray().then((flyers)=>flyers.filter((flyer)=>flyer.parentuserid === parentUserId))
            const flyerToRetrieve = flyersArray[0]
            
            return FlyersService.getFlyerbyId(db,1)
            .then(actual =>{
                expect(actual.title).to.eql(flyerToRetrieve.title)
                expect(actual.flyeraction).to.eql(flyerToRetrieve.flyeraction)
                expect(actual.actiondate).to.eql(new Date(flyerToRetrieve.actiondate))
                expect(actual.eventlocation).to.eql(flyerToRetrieve.eventlocation)
                expect(actual.eventstartdate).to.eql(new Date(flyerToRetrieve.eventstartdate))
                expect(actual.eventenddate).to.eql(new Date(flyerToRetrieve.eventenddate))
                expect(actual.category).to.eql(flyerToRetrieve.category)
                expect(atob(actual.flyerimage)).to.eql(flyerToRetrieve.flyerimage)
            })
        })


        it(`updateFlyer returns the updated flyer`, async ()=>{
            
            const parentUserId = 1
            const flyersArray = await makeFlyersArray().then((flyers)=>flyers.filter((flyer)=>flyer.parentuserid === parentUserId))
            const flyerToUpdate = flyersArray[0]
            flyerToUpdate.title = 'Updated Flyer Title'
            flyerToUpdate.eventlocation = 'New Place New Time'
            
            return FlyersService.updateFlyer(db,flyerToUpdate.id, flyerToUpdate)
            .then(()=>{
                return FlyersService.getFlyerbyId(db, flyerToUpdate.id)
                .then((actual)=>{
                    expect(actual.title).to.eql(flyerToUpdate.title)
                    expect(actual.flyeraction).to.eql(flyerToUpdate.flyeraction)
                    expect(actual.actiondate).to.eql(new Date(flyerToUpdate.actiondate))
                    expect(actual.eventlocation).to.eql(flyerToUpdate.eventlocation)
                    expect(actual.eventstartdate).to.eql(new Date(flyerToUpdate.eventstartdate))
                    expect(actual.eventenddate).to.eql(new Date(flyerToUpdate.eventenddate))
                    expect(actual.category).to.eql(flyerToUpdate.category)
                    expect(atob(actual.flyerimage)).to.eql(flyerToUpdate.flyerimage)
                })
            } 
            )
        })



        it(`deleteFlyerbyId removes the flyer from the database`, async ()=>{
            
             const parentUserId = 1
             const flyersArray = await makeFlyersArray().then((flyers)=>flyers.filter((flyer)=>flyer.parentuserid === parentUserId))
             const expectedArray = flyersArray.filter((flyer)=>flyer.id !== flyersArray[0].id)
            
            return FlyersService.deleteFlyer(db,flyersArray[0].id)
            .then(()=>{
                return FlyersService.getAllFlyers(db, parentUserId)
                .then((actual)=>{
                    expect(actual.title).to.eql(expectedArray.title)
                    expect(actual.flyeraction).to.eql(expectedArray.flyeraction)
                    expect(actual.actiondate).to.eql(expectedArray.actiondate)
                    expect(actual.eventlocation).to.eql(expectedArray.eventlocation)
                    expect(actual.eventstartdate).to.eql(expectedArray.eventstartdate)
                    expect(actual.eventenddate).to.eql(expectedArray.eventenddate)
                    expect(actual.category).to.eql(expectedArray.category)
                    expect(actual.flyerimage).to.eql(expectedArray.flyerimage)
                })
                
                })
            })
        })

        
    })
