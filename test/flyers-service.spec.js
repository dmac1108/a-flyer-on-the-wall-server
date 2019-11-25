const FlyersService = require('../src/Flyers/Flyers-Service')
const knex = require('knex')
const {makeUsersArray, makeChildrenArray, makeBuffers, makeFlyersArray, encodeImageFiles} = require('./flyer.fixtures')


describe.only(`FlyersService`, function(){
    
    let db

    before(() =>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    const testUsers = makeUsersArray()
    const children = makeChildrenArray()
    // const testFlyers = makeFlyersArray()
    // testFlyers.then((values) => console.log(values))
    

    // after(() => db.destroy())

    // before('clean the table', () => db.raw('TRUNCATE flyers, children, users RESTART IDENTITY CASCADE'))

    // afterEach('clean the table', () => db.raw('TRUNCATE flyers, children, users RESTART IDENTITY CASCADE'))

    context(`there is no data in the 'flyers' table`, ()=>{
        beforeEach(()=>{
            return db
            .into('users')
            .insert(testUsers)
        })

        it(`getAllFlyers returns an empty array`, ()=>{
            const parentUserId = 1
            return FlyersService.getAllFlyers(db, parentUserId)
            .then(actual=>{
                expect(actual).to.eql([])
            })
            
        })

        // it.skip(`insertFlyer inserts a new flyer and returns it`, ()=>{
        //     const flyerToInsert = flyers[1]
        //     return FlyersService.insertFlyer(db,flyerToInsert)
        //     .then(actual =>{
        //         expect(actual).to.eql({
        //             id: flyerToInsert.id,
        //             title: flyerToInsert.title,
        //             eventlocation: flyerToInsert.eventlocation,
        //             eventstartdate: flyerToInsert.eventstartdate,
        //             actiondate: flyerToInsert.actiondate,
        //             flyeraction: flyerToInsert.flyeraction,
        //             category: flyerToInsert.category,
        //         })
        //     })
        // })
    })

    context(`there is data in the 'flyers' table`, ()=>{
        
        

        // const testPromise = new Promise((resolve, reject)=>{
        beforeEach(()=>{
                return db.into('users')
                .insert(testUsers)
                .then(()=>{
                    return db.into('children')
                    .insert(children)
                    .then(()=>{
                        
                        makeFlyersArray().then((flyers) =>{
                    
                        db.into('flyers')
                        .insert(flyers)
                    })
                    .catch((error) => console.error(error))
                    })
                    
                })
  
            })
 
        it(`getAllFlyers returns all flyers in the 'flyers' table`, ()=>{
            const parentUserId = 1
            return FlyersService.getAllFlyers(db, parentUserId)
            .then(actual =>{
                console.log(actual)
            })
        })

        it.skip(`getFlyerbyId returns the flyer`, ()=>{
            const flyerToRetrieve = flyers[1]
            return FlyersService.getFlyerbyId(db,flyerToRetrieve.id)
            .then(actual =>{
                expect(actual).to.eql({
                    id: flyerToRetrieve.id,
                    title: flyerToRetrieve.title,
                    eventlocation: flyerToRetrieve.eventlocation,
                    eventstartdate: flyerToRetrieve.eventstartdate,
                    actiondate: flyerToRetrieve.actiondate,
                    flyeraction: flyerToRetrieve.flyeraction,
                    category: flyerToRetrieve.category,
                })
            })
        })
        })
    // })
})