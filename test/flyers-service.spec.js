const FlyersService = require('../src/Flyers/Flyers-Service')

const knex = require('knex')
const {makeUsersArray, makeChildrenArray, makeFlyersNoImagesArray, makeFlyersArray} = require('./flyer.fixtures')

describe(`FlyersService`, function(){
    
    let db

    before(() =>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
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


        

        it(`insertFlyer inserts a new flyer and returns it`, ()=>{
            
            const flyerPromise = new Promise((resolve, reject)=>{
                makeFlyersArray()
                .then((values)=>{
                    resolve(values)
                })
            })
            
            
            const flyerToInsert = flyerPromise[0]
            console.log(flyerToInsert)
            return FlyersService.insertFlyer(db,flyerToInsert)
            .then(actual =>{
                console.log(actual)
                // expect(actual).to.eql({
                    
                //     title: flyerToInsert.title,
                //     eventlocation: flyerToInsert.eventlocation,
                //     eventstartdate: flyerToInsert.eventstartdate,
                //     actiondate: flyerToInsert.actiondate,
                //     flyeraction: flyerToInsert.flyeraction,
                //     category: flyerToInsert.category,
                // })
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
 
        it(`getAllFlyers returns all flyers in the 'flyers' table`, ()=>{
            const parentUserId = 1
            const expectedFlyersParentId1 = flyersArrayNoImages.filter((flyer)=>flyer.parentid === 1)
            return FlyersService.getAllFlyers(db, parentUserId)
            .then(actual =>{
                expect(actual.title).to.eql(expectedFlyersParentId1.title)
                expect(actual.flyeraction).to.eql(expectedFlyersParentId1.flyeraction)
                expect(actual.actiondate).to.eql(expectedFlyersParentId1.actiondate)
                expect(actual.eventlocation).to.eql(expectedFlyersParentId1.eventlocation)
                expect(actual.eventstartdate).to.eql(expectedFlyersParentId1.eventstartdate)
                expect(actual.eventenddate).to.eql(expectedFlyersParentId1.eventenddate)
                expect(actual.category).to.eql(expectedFlyersParentId1.category)
                
            })
        })

        it(`getFlyerbyId returns the flyer`, ()=>{
            const flyerToRetrieve = flyersArrayNoImages[0]
            
            return FlyersService.getFlyerbyId(db,1)
            .then(actual =>{
                expect(actual.title).to.eql(flyerToRetrieve.title)
                expect(actual.flyeraction).to.eql(flyerToRetrieve.flyeraction)
                // expect(actual.actiondate).to.equalDate(flyerToRetrieve.actiondate)
                expect(actual.eventlocation).to.eql(flyerToRetrieve.eventlocation)
                // expect(actual.eventstartdate).to.eql(flyerToRetrieve.eventstartdate)
                // expect(actual.eventenddate).to.eql(flyerToRetrieve.eventenddate)
                expect(actual.category).to.eql(flyerToRetrieve.category)
            })
        })
        })
    })
