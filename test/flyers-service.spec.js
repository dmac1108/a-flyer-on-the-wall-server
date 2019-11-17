const FlyersService = require('../src/Flyers/Flyers-Service')
const knex = require('knex')
const {makeChildrenArray, makeBuffers, makeFlyersArray} = require('./flyer.fixtures')
const {makeFlyers} = require('./flyers-store')

describe.only(`FlyersService`, function(){
    
    let db
    const children = makeChildrenArray()
    const flyers = makeFlyers()
    /*const flyers = Promise.resolve(makeBuffers()).then(function(values){
        console.log('in the flyerstest', values)
        makeFlyersArray(values)
    })*/



    //const flyers = makeFlyersArray()
    

    before(() =>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    //after(() => db.destroy())

    //before('clean the table', () => db.raw('TRUNCATE flyers_children, flyers, children RESTART IDENTITY CASCADE'))

    //afterEach('clean the table', () => db.raw('TRUNCATE flyers_children, flyers, children RESTART IDENTITY CASCADE'))

    context(`there is no data in the 'flyers' table`, ()=>{
        it(`getAllFlyers returns an empty array`, ()=>{
            return FlyersService.getAllFlyers(db)
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

    context.skip(`there is data in the 'flyers' table`, ()=>{
        beforeEach(()=>{
            
            return db
            .into('children')
            .insert(children)
            .then(()=>{
                
                return db
                .into('flyers')
                .insert(flyers)
            })
        })
        //afterEach(()=> db.raw('TRUNCATE flyers_children, flyers, children RESTART IDENTITY CASCADE'))

        it(`getAllFlyers returns all flyers in the 'flyers' table`, ()=>{
            return FlyersService.getAllFlyers(db)
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
    })










