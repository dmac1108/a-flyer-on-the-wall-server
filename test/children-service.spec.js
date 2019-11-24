const ChildrenService = require('../src/Children/Children-Service')
const knex = require('knex')
const flyersFixture = require('./flyer.fixtures')

describe.only(`Children Service object`, function(){
    
    let db
    let testUsers = flyersFixture.makeUsersArray()
    let testChildren = flyersFixture.makeChildrenArray()

    before(() =>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    after(() => db.destroy())

    beforeEach(() => db.raw('TRUNCATE children, users RESTART IDENTITY CASCADE'))

    afterEach(() => db.raw('TRUNCATE children, users RESTART IDENTITY CASCADE'))

    context(`Given 'children' has no data`, ()=>{
            beforeEach(()=>{
                return db
                .into('users')
                .insert(testUsers)
            })

            it(`GetAllChildren returns an empty array`, ()=>{
                const parentId = 1
                return ChildrenService.getAllChildren(db, parentId)
                .then(actual =>{
                    expect(actual).to.eql([])
                })
            })

            it(`insertChild() inserts a new child and resolves the new child with an id`, ()=>{
                const newTestChild = {childname: "Joe", parentid: 1}
                return ChildrenService.insertChild(db,newTestChild)
                .then(actual =>{
                    
                    expect(actual).to.eql({
                        id: 1,
                        childname: newTestChild.childname,
                        parentid: 1
                  
                    })
                })
            })
        } )


    context(`Given 'children' has data`, ()=>{
            beforeEach(()=>{
                return db
                .into('users')
                .insert(testUsers)
                .then(()=>{
                    return db
                    .into('children')
                    .insert(testChildren)})
            })
            afterEach(() => db.raw('TRUNCATE children, users RESTART IDENTITY CASCADE'))
            
            it(`getAllChildren resolves all children for given parentid from 'Children' table`, () =>{
                const testParentId = 1
                
                expectedChildrenArray = testChildren.filter((child)=>
                    child.parentid == testParentId
                )
                
                return ChildrenService.getAllChildren(db, testParentId)
                .then(actual =>{
                    
                    
                    for(let i=0; i<actual.length; i++){
                        expect(actual[i].childname).to.eql(expectedChildrenArray[i].childname)
                        expect(actual[i].parentid).to.eql(expectedChildrenArray[i].parentid)
                    }
                    
                })
            })

            
            it(`getChildById resolves the correct child given id`, ()=>{
                const testChild = testChildren[0]
                return ChildrenService.getChildbyId(db,1)
                .then(actual =>{
                    expect(actual.childname).to.eql(testChild.childname)
                    expect(actual.parentid).to.eql(testChild.parentid)
                })
            })

            
            
        })
        
    })
