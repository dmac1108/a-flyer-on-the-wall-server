const Knex = require("knex")

const UsersService = {
    getAllUsers(db){
        return db.select('*').from('users')
    },
    getUserById(db, userId){
        return db.select('*')
        .from('users')
        .where('userid', userId)
        .first()
    },
    getUserByUsername(db, username){
        return db.select('*')
        .from('users')
        .where('username', username)
        .first()
    },
    insertNewUser(db, newUser){
        return db.into('users')
        .insert(newUser)
        .returning('*')
        .then((rows) =>{
            return rows[0]
        })
    },
    updateUser(db, updatedUserInfo, userId){
        return db('users')
        .where('userid', userId)
        .update(updatedUserInfo)
        
    }
}

module.exports = UsersService