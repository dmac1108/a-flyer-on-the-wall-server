const knex = require('knex')
const app = require('../src/app')
const {makeChildrenArray, makeAuthHeader, makeUsersArray} = require('./flyer.fixtures')

describe(`Chilrens Endpoints`, ()=>{
const testUsers = makeUsersArray()

let db

before('make knex instance', ()=>{
    db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
    })
    app.set('db',db)
})

after('disconnect from db', ()=> db.destroy())

before('clean the table', ()=>
db.raw('TRUNCATE children, users RESTART IDENTITY CASCADE'))

afterEach('cleanup', ()=>db.raw('TRUNCATE children, users RESTART IDENTITY CASCADE'))

describe('GET /api/children', function(){
    

    context(`No data in 'children' table'`, ()=>{
        beforeEach(()=>{
            return db
            .into('users')
            .insert(testUsers)
        })
        it('returns an empty array', ()=>{
            const testUser = testUsers[0]
            return supertest(app)
            .get('/api/children')
            .set('Authorization', makeAuthHeader({username: testUser.username, password: testUser.user_password}) )
            .expect(200, [])
        })


    })

    context(`there is data in the 'children' table`, ()=>{
        const childrenArray = makeChildrenArray()

        beforeEach(()=>{
            return db
            .into('users')
            .insert(testUsers)
            .then(()=>{
                return db
                .insert(childrenArray)
                .into('children')
            })
        })

        it(`responds with 200 and all of the children`, ()=>{
            const testUser = testUsers[0]
            const expectedChildren = childrenArray.filter((child)=>child.parentid == testUser.userid)
            return supertest(app)
            .get('/api/children')
            .set('Authorization', makeAuthHeader({username: testUser.username, password: testUser.user_password}) )
            .expect(200,expectedChildren)
        })

    })
})

describe(`GET /:id`, function(){
    context(`there is no data in the 'children' table`, ()=>{
        const childrenArray = makeChildrenArray()
        beforeEach(()=>{
            return db
            .into('users')
            .insert(testUsers)
            .then(()=>{
                return db
                .insert(childrenArray)
                .into('children')
            })
        })

        it(`returns 404 and error message`, ()=>{
            const testUser = testUsers[0]
            const invalidId = 12523;
            return supertest(app)
            .get(`/api/children/${invalidId}`)
            .set('Authorization', makeAuthHeader({username: testUser.username, password: testUser.user_password}) )
            .expect(404, {error:
                {message: 'Child does not exist'}
            })
        })

    })

    context(`there is data in the 'children' table`, ()=>{
        const childrenArray = makeChildrenArray()

        beforeEach(()=>{
            return db
            .into('users')
            .insert(testUsers)
            .then(()=>{
                return db
                .insert(childrenArray)
                .into('children')
            })
        })

        it(`returns the child`, ()=>{
            const testUser = testUsers[0]
            const childtoFind = childrenArray[0]
            return supertest(app)
            .get(`/api/children/${childtoFind.id}`)
            .set('Authorization', makeAuthHeader({username: testUser.username, password: testUser.user_password}) )
            .expect(200, childtoFind)
        })
    })
})

describe(`POST /:id`, function(){
    beforeEach(()=>{
        return db
        .into('users')
        .insert(testUsers)
    })
    it(`creates a new child and returns the child`, ()=>{
        const newTestChild = {
            childname: "Test Child",
        }
        const testUser = testUsers[0]
        return supertest(app)
        .post('/api/children')
        .set('Authorization', makeAuthHeader({username: testUser.username, password: testUser.user_password}) )
        .send(newTestChild)
        .expect(201)
        .expect(res =>{
            expect(res.body.childname).to.eql(newTestChild.childname)
            expect(res.body).to.have.property('id')
        })
        .then(postRes =>{
            supertest(app)
            .get(`/api/children/${postRes.body.id}`)
            .set('Authorization', makeAuthHeader({username: testUser.username, password: testUser.user_password}) )
            .expect(postRes.body)
        })
            
    })

    it(`responds with 401 and and error message if missing child name`, ()=>{
        const newTestChild = {childname: null}
        const testUser = testUsers[0]
        return supertest(app)
        .post('/api/children')
        .set('Authorization', makeAuthHeader({username: testUser.username, password: testUser.user_password}) )
        .send(newTestChild)
        .expect(400, {error: {message: 'Missing the childname in the request body'}})
    })

})

})
