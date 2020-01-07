const knex = require('knex')
const app = require('../src/app')
const {makeAuthHeader, makeUsersArray, makeFlyerCategoriesArray} = require('./flyer.fixtures')


describe(`Flyer_Categories Endpoint`, ()=>{


    let db
    const testUsers = makeUsersArray()
    const testCategories = makeFlyerCategoriesArray()

    before('make knex instance', ()=>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db',db)
    })
    
   after('disconnect from db', ()=> db.destroy())
    
    before('clean the table', ()=>
    db.raw('TRUNCATE flyer_categories, users RESTART IDENTITY CASCADE'))
    
    afterEach('cleanup', ()=>db.raw('TRUNCATE flyer_categories, users RESTART IDENTITY CASCADE'))

    describe('GET /api/flyer_categories', ()=>{
        context(`there is no data in the 'flyer_categories' table`, ()=>{
            beforeEach(()=>{
                return db
                .into('users')
                .insert(testUsers)
            })

            it('returns an empty array', ()=>{
                const testUser = testUsers[0]
                return supertest(app)
                .get('/api/flyers_categories')
                .set('Authorization', makeAuthHeader({username: testUser.username, password: testUser.user_password}) )
                .expect(200, [])

            })

        })

        context(`there is data in the 'flyer_categories' table`, ()=>{
            beforeEach(()=>{
                return db
                .into('users')
                .insert(testUsers)
                .then(()=>{
                    return db('flyer_categories')
                    .insert(testCategories)
                })
            })

            it('returns all categories for a test user', ()=>{
                const testUser = testUsers[0]
                const expectedCategories = testCategories.filter(category => category.parentuserid === testUser.userid)
                
                return supertest(app)
                .get('/api/flyers_categories')
                .set('Authorization', makeAuthHeader({username: testUser.username, password: testUser.user_password}) )
                .expect(200)
                .then(response =>{
                    
                    expect(response.body[0].category).to.eql(expectedCategories[0].category)
                    expect(response.body[0].parentuserid).to.eql(expectedCategories[0].parentuserid)
                    
                })
            })
        })
    })

    describe('POST api/flyers_categories', ()=>{
        beforeEach(()=>{
            return db
            .into('users')
            .insert(testUsers)
        })

        it('returns 400 and error message if no category', ()=>{
            const testUser = testUsers[0]
            const testCategory =  {id: 1, parentuserid: 2}
            
            return supertest(app)
            .post('/api/flyers_categories')
            .set('Authorization', makeAuthHeader({username: testUser.username, password: testUser.user_password}) )
            .send(testCategory)
            .expect(400, {
                error: {
                    message: `Missing the category in the request body`
                }
            })


        })

        it('creates a new category and returns the category object', ()=>{
            const testUser = testUsers[0]
            const testCategory = testCategories[0]
            
            return supertest(app)
            .post('/api/flyers_categories')
            .set('Authorization', makeAuthHeader({username: testUser.username, password: testUser.user_password}) )
            .send(testCategory)
            .expect(201)
            .then((response)=>{
                expect(response.body.category).to.eql(testCategory.category)
                expect(response.body.parentuserid).to.eql(testUser.userid)
                
            })
        })



    })






})


