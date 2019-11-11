const knex = require('knex')
const app = require('../src/app')
const {makeChildrenArray} = require('./flyer.fixtures')


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
db.raw('TRUNCATE flyers_children, children RESTART IDENTITY CASCADE'))

afterEach('cleanup', ()=>db.raw('TRUNCATE flyers_children, children RESTART IDENTITY CASCADE'))

describe('GET /api/children', function(){
    context(`No data in 'children' table'`, ()=>{
        it('returns an empty array', ()=>{
            return supertest(app)
            .get('/api/children')
            .expect(200, [])
        })


    })

    context(`there is data in the 'children' table`, ()=>{
        const childrenArray = makeChildrenArray()

        beforeEach(`insert data into the test db`, ()=>{
            return db
            .insert(childrenArray)
            .into('children')
        })

        it(`responds with 200 and all fo the notes`, ()=>{
            return supertest(app)
            .get('/api/children')
            .expect(200,childrenArray)
        })

    })
})

describe(`GET /:id`, function(){
    context(`there is no data in the 'children' table`, ()=>{
        it(`returns 404 and error message`, ()=>{
            const invalidId = 12523;
            return supertest(app)
            .get(`/api/children/${invalidId}`)
            .expect(404, {error:
                {message: 'Child does not exist'}
            })
        })

    })

    context(`there is data in the 'children' table`, ()=>{
        const childrenArray = makeChildrenArray()

        beforeEach(`insert data into the test db`, ()=>{
            return db
            .insert(childrenArray)
            .into('children')
        })

        it(`returns the child`, ()=>{
            const childtoFind = childrenArray[0]
            return supertest(app)
            .get(`/api/children/${childtoFind.id}`)
            .expect(200, childtoFind)
        })
    })
})

describe(`POST /:id`, function(){

    it(`creates a new child and returns the child`, ()=>{
        const newTestChild = {
            childname: "Test Child"
        }
        return supertest(app)
        .post('/api/children')
        .send(newTestChild)
        .expect(201)
        .expect(res =>{
            expect(res.body.childname).to.eql(newTestChild.childname)
            expect(res.body).to.have.property('id')
        })
        .then(postRes =>{
            supertest(app)
            .get(`/api/children/${postRes.body.id}`)
            .expect(postRes.body)
        })
            
    })

    it(`responds with 401 and and error message if missing child name`, ()=>{
        const newTestNote = {childname: null}
        return supertest(app)
        .post('/api/children')
        .send(newTestNote)
        .expect(400, {error: {message: 'Missing the childname in the request body'}})
    })

})
