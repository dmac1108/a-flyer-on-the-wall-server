const Knex = require("knex")
const bcrypt = require('bcryptjs')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

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
        
    },
    validatePassword(password){
        if(password.length < 8){
            return 'Password must be longer than 8 characters'
        }
        if(password.length > 72){
            return 'Password must be less than 72 characters'
        }
        if(password.startsWith(' ') || password.endsWith(' ')){
            return 'Password must not start or end with empty spaces'
        }
        if(!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)){
            return 'Password must contain 1 upper case, lower case, number and special character'
        }
        return null
            
    },
    hashPassword(password){
        return bcrypt.hash(password,12)
    },


}

module.exports = UsersService