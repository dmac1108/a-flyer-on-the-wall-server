const FlyersCategoriesService = require('../src/Flyer_Categories/Flyers_Categories-Service')
const knex = require('knex')
const {makeUsersArray, makeFlyerCategoriesArray} = require('./flyer.fixtures')

describe('Flyers_CategoriesService', ()=>{

    let db

        before(() =>{
            db = knex({
                client: 'pg',
                connection: process.env.TEST_DATABASE_URL,
            })
        })

    const testUsers = makeUsersArray()
    const testCategories = makeFlyerCategoriesArray()
    

    after(() => db.destroy())

    before('clean the table', () => db.raw('TRUNCATE flyer_categories, users RESTART IDENTITY CASCADE'))

    afterEach('clean the table', () => db.raw('TRUNCATE flyer_categories, users RESTART IDENTITY CASCADE'))

    context('there is no data in the database', ()=>{

        beforeEach(()=>{
            return db
            .into('users')
            .insert(testUsers)
            
        })

        it('returns an empty array', ()=>{
            const testUser = testUsers[0].userid
            return FlyersCategoriesService.getFlyers_Categories(db,testUser)
            .then((res)=>{
                expect(res).to.eql([])
            })
        })
        it('inserts and returns new category', ()=>{
            const testCategory = testCategories[0]
            return FlyersCategoriesService.insertFlyer_Category(db,testCategory)
            .then(actual =>{
                    
                expect(actual).to.eql({
                    id: testCategory.id,
                    category: testCategory.category,
                    parentuserid: testCategory.parentuserid
              
                })
            })
        })
    })

    context('there is data in the database', ()=>{
        beforeEach(()=>{
            return db
            .into('users')
            .insert(testUsers)
            .then(()=>{
                return db.into('flyer_categories')
                .insert(testCategories)
                })
            
        })

        it('returns all categories for test user', ()=>{
            const testUser = testUsers[0].userid
            const userCategories = testCategories.filter(category => category.parentuserid === testUser)
            return FlyersCategoriesService.getFlyers_Categories(db, testUser)
            .then((categories)=>{
                expect(categories).to.eql(userCategories)
            })
            
        })
    })

})