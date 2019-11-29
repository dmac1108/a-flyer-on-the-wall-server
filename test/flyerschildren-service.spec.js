const Flyers_ChildrenService = require('../src/Flyers_Children/Flyers_Children-Service')
const {makeUsersArray, makeChildrenArray, makeFlyersNoImagesArray, makeFlyersArray, makeFlyersChildrenArray} = require('./flyer.fixtures')
const knex = require('knex')

describe(`Flyers_Children Service object`, function(){
    
    let db
    

    before(() =>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
    })

    const testUsers = makeUsersArray()
    const children = makeChildrenArray()
    const testFlyersChildren = makeFlyersChildrenArray()

    after(() => db.destroy())

    before(() => db.raw('TRUNCATE flyers_children, flyers, children, users RESTART IDENTITY CASCADE'))

    afterEach(() => db.raw('TRUNCATE flyers_children, flyers, children, users RESTART IDENTITY CASCADE'))

    context(`Given 'flyeres_children' has no data`, ()=>{

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

            it(`getallflyers_children returns an empty array`, ()=>{
                return Flyers_ChildrenService.getAllFlyers_Children(db)
                .then(actual =>{
                    expect(actual).to.eql([])
                })
            })

            it(`insertflyerchild() inserts a new flyer child and resolves the new flyerchild with an id`, ()=>{
                const newTestChild = [{childid: 1, flyerid: 2}]
                return Flyers_ChildrenService.insertFlyers_Children(db,newTestChild)
                .then(actual =>{
                    
                    expect(actual[0]).to.eql({
                        id: 1,
                        childid: newTestChild[0].childid,
                        flyerid: newTestChild[0].flyerid
                  
                    })
                })
            })
        } )

    

    
    context(`Given 'flyers_children' has data`, ()=>{
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
                .then(()=>{
                    return db.into('flyers_children')
                    .insert(testFlyersChildren)
                })
            })
        })
        afterEach(() => db.raw('TRUNCATE flyers_children, flyers, children, users RESTART IDENTITY CASCADE'))

            it(`getAllFlyersChildren resolves all flyers_children from 'flyers_children' table`, () =>{
                return Flyers_ChildrenService.getAllFlyers_Children(db)
                .then(actual =>{
                    expect(actual.length).to.eql(testFlyersChildren.length)
                    expect(actual[0].childid).to.eql(testFlyersChildren[0].childid)
                    expect(actual[0].flyerid).to.eql(testFlyersChildren[0].flyerid)
                })
            })

            
            it(`getFlyerChildByChildId resolves the correct flyer_child given childid`, ()=>{
                const testChild = testFlyersChildren[0]
                return Flyers_ChildrenService.getFlyers_ChildrenByChildId(db,testChild.childid)
                .then(actual =>{
                    expect(actual[0].childid).to.eql(testChild.childid)
                    expect(actual[0].flyerid).to.eql(testChild.flyerid)

                })
            })

            it(`getFlyerChildByFlyerId resolves the correct flyer_child given flyerid`, ()=>{
                const testChild = testFlyersChildren[0]
                return Flyers_ChildrenService.getFlyers_ChildrenByFlyerId(db,testChild.flyerid)
                .then(actual =>{
                    expect(actual[0].childid).to.eql(testChild.childid)
                    expect(actual[0].flyerid).to.eql(testChild.flyerid)

                })
            })

            
            
        })
        
    })
