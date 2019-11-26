const knex = require('knex')
const app = require('../src/app')
const {makeUsersArray, makeChildrenArray, makeFlyersNoImagesArray, makeFlyersArray, makeFlyersChildrenArray} = require('./flyer.fixtures')

describe('Protected endpoints', function(){

let db

const testUsers = makeUsersArray()
const testChildren = makeChildrenArray()
const testFlyersChildren = makeFlyersChildrenArray()

before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })



beforeEach(()=>{
    return db.into('users')
    .insert(testUsers)
    .then(()=>{
        return db.into('children')
        .insert(testChildren)
        
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
after('disconnect from db', ()=> db.destroy())

afterEach(() => db.raw('TRUNCATE flyers_children, flyers, children, users RESTART IDENTITY CASCADE'))

const protectedEndpoints = [
    {
        name: 'GET /api/flyers',
        path: '/api/flyers',
        method: supertest(app).get,
      },
      {
        name: 'GET /api/children',
        path: '/api/children',
        method: supertest(app).get,
      },
      {
        name: 'GET /api/flyers_children',
        path: '/api/flyers_children',
        method: supertest(app).get,
      },
      {
        name: 'GET /api/categories',
        path: '/api/categories',
        method: supertest(app).get,
      },
      {
        name: 'GET /api/flyers/:id',
        path: '/api/flyers',
        method: supertest(app).get,
      },
      {
        name: 'POST /api/flyers',
        path: '/api/flyers',
        method: supertest(app).post,
      },
      {
        name: 'POST /api/children',
        path: '/api/children',
        method: supertest(app).post,
      },
      {
        name: 'POST /api/categories',
        path: '/api/categories',
        method: supertest(app).post,
      },
      {
        name: 'POST /api/flyers_children',
        path: '/api/flyers_children',
        method: supertest(app).post,
      },
      {
        name: 'PATCH /api/flyers/:id',
        path: '/api/flyers/:id',
        method: supertest(app).patch,
      },
]


})
