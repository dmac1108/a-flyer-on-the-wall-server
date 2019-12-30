const xss = require('xss')
const express = require('express')
const path = require('path')
const Flyers_CategoriesService = require('./Flyers_Categories-Service')

const {requireAuth} = require('../middleware/jwt-auth')

const flyers_CategoriesRouter = express.Router()
const jsonBodyParser = express.json();

const serializeFlyers_Categories = category => ({
    
    id: category.id,
    category: xss(category.category),
    parentuserid: category.parentuserid
})

flyers_CategoriesRouter
.route('/')
.all(requireAuth)
.get((req,res,next)=>{
    
    Flyers_CategoriesService.getFlyers_Categories(req.app.get('db'), req.user.userid)
    .then(categories =>{
        
        res.json(categories.map(serializeFlyers_Categories))
    })
    .catch(next)
})
.post(jsonBodyParser, (req,res,next)=>{
    const {category} = req.body
    const newCategory = {category}
    
    for (const [key, value] of Object.entries(newCategory))
        if(value == null){
        
        return res.status(400)
        .json({
            error: {
                message: `Missing the category in the request body`
            }
        })
    }

    newCategory.parentuserid = req.user.userid
    
    Flyers_CategoriesService.insertFlyer_Category(req.app.get('db'), newCategory)
    .then(category =>{
        res.status(201)
        .location(path.posix.join(req.originalUrl, `/${category.id}`))
        .json(serializeFlyers_Categories(category))
    })
    .catch(next)

})

module.exports = flyers_CategoriesRouter




