const UsersService = require('../src/Users/Users-Service')
const knex = require('knex')
const {makeUsersArray} = require('./flyer.fixtures')

describe('Users Service', ()=>{
    let db
    const testUsers = makeUsersArray()
    
    before(() =>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    after(() => db.destroy())

    before('clean the table', () => db.raw('TRUNCATE users RESTART IDENTITY CASCADE'))

    afterEach('clean the table', () => db.raw('TRUNCATE users RESTART IDENTITY CASCADE'))

    context(`there is no data in the 'users' table`, ()=>{
        it(`returns an empty array when there is no data in the 'users' table'`, ()=>{
            return UsersService.getAllUsers(db)
            .then(actual=>{
                expect(actual).to.eql([])
            })
        })

        it(`insertNewUser inserts a new user and returns the user`, ()=>{
            const userToInsert = testUsers[0]
            return UsersService.insertNewUser(db, userToInsert)
            .then(actual =>{
                expect(actual).to.eql({
                    userid: 1,
                    firstname: userToInsert.firstname,
                    lastname: userToInsert.lastname,
                    email: userToInsert.email,
                    username: userToInsert.username,
                    user_password: userToInsert.user_password
                
            })
        })

    })

})

    context('there is data in the database', ()=>{
        beforeEach(()=>{
            return db
            .into('users')
            .insert(testUsers)
        })
        it(`GetUserById returns the correct user`, ()=>{
            const testUser = testUsers[0]
            return UsersService.getUserById(db, 1)
            .then(actual =>{
                expect(actual.userid).to.eql(1)
                expect(actual.username).to.eql(testUser.username)
                expect(actual.password).to.eql(testUser.password)
                expect(actual.firstname).to.eql(testUser.firstname)
                expect(actual.lastname).to.eql(testUser.lastname)
                expect(actual.email).to.eql(testUser.email)
            })
        })
        it(`GetUserByUsername returns the correct user`, ()=>{
            const testUser = testUsers[0]
            return UsersService.getUserByUsername(db, testUser.username)
            .then(actual =>{
                expect(actual.userid).to.eql(1)
                expect(actual.username).to.eql(testUser.username)
                expect(actual.password).to.eql(testUser.password)
                expect(actual.firstname).to.eql(testUser.firstname)
                expect(actual.lastname).to.eql(testUser.lastname)
                expect(actual.email).to.eql(testUser.email)
            })
        })
        it(`UpdateUserById updates the user and returns the correct fields`, ()=>{
            const updatedUserFields = {email: 'jsmith@test.com'}
            const testUser = testUsers[0]
            return UsersService.updateUser(db, updatedUserFields,1)
            .then(actual =>{
                return UsersService.getUserById(db, 1)
                .then(actual =>{
                expect(actual.email).to.eql(updatedUserFields.email)
                expect(actual.username).to.eql(testUser.username)
                expect(actual.password).to.eql(testUser.password)
                expect(actual.firstname).to.eql(testUser.firstname)
                expect(actual.lastname).to.eql(testUser.lastname)
            })
        })
    })


    })
})