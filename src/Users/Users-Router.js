const xss = require('xss')
const express = require('express')
const path = require('path')
const UsersService = require('./Users-Service');

const usersRouter = express.Router()
const jsonBodyParser = express.json()

const serializeUsers = user => ({
    userid: user.userid,
    firstname: xss(user.firstname),
    lastname: xss(user.lastname),
    email: xss(user.email),
    username: xss(user.username),
    user_password: xss(user.user_password),
    
})



usersRouter
.route('/')
.get((req, res, next)=>{
    UsersService.getAllUsers(req.app.get('db'))
    .then((users)=>{
        res.json(users.map(serializeUsers))
    })
})
.post(jsonBodyParser, (req, res, next)=>{
    const {firstname, lastname, email, username, user_password} = req.body
    //console.log(req.body)
    const newUser = {firstname, lastname, email, username, user_password}

    for (const [key, value] of Object.entries(newUser))
        if(value == null){
            return res.status(400)
            .json({
                error: {
                    message: `Missing the ${key} in the request body`
                }
            })
        }
    
    UsersService.getUserByUsername(req.app.get('db'), username)
    .then((user)=>{
        if(user){
            return res.status(400)
            .json({
                error: {
                    message: `User with username already exists`
                }
            }) 
        }
    })
    



    UsersService.insertNewUser(req.app.get('db'), newUser)
    .then(user =>{
        res.status(201)
        .location(path.posix.join(req.originalUrl, `/${user.userid}`))
        .json(serializeUsers(user))
    })
    .catch(next)
})

usersRouter
.route('/:id')
.all((req, res, next)=>{
    const userId = req.params.id
    UsersService.getUserById(req.app.get('db'), userId)
    .then((user)=>{
        if(!user){
            return res.status(400)
            .json({
                error: {
                    message: `User not found`
                }
            })
        }

        res.user = user
            
        next()
    })
    .catch(next)
})
.get((req, res, next)=>{
    res.json(serializeUsers(res.user))
})
.patch(jsonBodyParser, (req, res, next)=>{
    const userId = req.params.id
    const {firstname, lastname, email, user_password} = req.body
    const updatedUserInfo = {firstname, lastname, email, user_password}

    UsersService.updateUser(req.app.get('db'), updatedUserInfo, userId)
    .then((user)=>{
        res.status(204).end()
        .json(serializeUsers(user))
    })
    .catch(next)
})


module.exports = usersRouter