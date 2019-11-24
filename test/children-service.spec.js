const ChildrenService = require('../src/Children/Children-Service')
const knex = require('knex')
const flyersFixture = require('./flyer.fixtures')

describe(`Children Service object`, function(){
    
    let db
    let testUsers = flyersFixture.makeUsersArray()
    console.log(testUsers[0])
    let testChildren = flyersFixture.makeChildrenArray()

    before(() =>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    after(() => db.destroy())

    beforeEach(() => db.raw('TRUNCATE flyers_children, children, users RESTART IDENTITY CASCADE'))

    afterEach(() => db.raw('TRUNCATE flyers_children, children, users RESTART IDENTITY CASCADE'))

    context(`Given 'children' has no data`, ()=>{
            it(`GetAllChildren returns an empty array`, ()=>{
                const parentId = 1
                return ChildrenService.getAllChildren(db, parentid)
                .then(actual =>{
                    expect(actual).to.eql([])
                })
            })

            it(`insertChild() inserts a new child and resolves the new child with an id`, ()=>{
                const newTestChild = {childname: "Joe"}
                return ChildrenService.insertChild(db,newTestChild)
                .then(actual =>{
                    
                    expect(actual).to.eql({
                        id: 1,
                        childname: newTestChild.childname,
                  
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
            afterEach(() => db.raw('TRUNCATE flyers_children, children, users RESTART IDENTITY CASCADE'))
            
            it(`getAllChildren resolves all children for given parentid from 'Children' table`, () =>{
                const testParentId = testUsers[0].id
                
                return ChildrenService.getAllChildren(db, testParentId)
                .then(actual =>{
                    expect(actual).to.eql(testChildren)
                })
            })

            
            it(`getChildById resolves the correct child given id`, ()=>{
                const testChild = testChildren[0]
                return ChildrenService.getChildbyId(db,testChild.id)
                .then(actual =>{
                    expect(actual.childname).to.eql(testChild.childname)
                })
            })

            
            
        })
        
    })
