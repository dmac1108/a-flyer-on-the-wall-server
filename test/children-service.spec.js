const ChildrenService = require('../src/Children/Children-Service')
const knex = require('knex')

describe(`Children Service object`, function(){
    
    let db
    let testChildren = [
        {
            id: 1,
            childname: "Dick",
        },
        {
            id: 2,
            childname: "Sally",
        },
        {
            id: 3,
            childname: "Jane",
        },
    ]

    before(() =>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    after(() => db.destroy())

    before(() => db.raw('TRUNCATE flyers_children, children RESTART IDENTITY CASCADE'))

    afterEach(() => db.raw('TRUNCATE flyers_children, children RESTART IDENTITY CASCADE'))

    context(`Given 'children' has no data`, ()=>{
            it(`GetAllChildren returns an empty array`, ()=>{
                return ChildrenService.getAllChildren(db)
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
                .into('children')
                .insert(testChildren)
            })
            afterEach(() => db('children').truncate())

            it(`getAllChildren resolves all children from 'Children' table`, () =>{
                return ChildrenService.getAllChildren(db)
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
