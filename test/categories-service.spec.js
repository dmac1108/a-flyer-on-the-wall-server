const CategoriesService = require('../src/Categories/Categories-Service')
const knex = require('knex')

describe(`Categories Service object`, function(){
    
    let db

    before(() =>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    after('disconnect from db', ()=> db.destroy())

    context(`Given category type has data`, ()=>{

            it(`getAllCategories resolves all categories  from 'category' type`, () =>{
                return CategoriesService.getAllCategories(db)
                .then(actual =>{
                    expect(actual[0]).to.eql({unnest: 'school'})
                })
            })

            it(`inserts a new category`, ()=>{
                const newCategory = 'test' + new Date()
                return CategoriesService.insertNewCategory(db,newCategory)
                .then(actual =>{
                    expect(actual).to.eql(newCategory)
                })
            })

            
            
        })
        
    })
