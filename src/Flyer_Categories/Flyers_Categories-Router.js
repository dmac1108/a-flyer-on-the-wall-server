const xss = require('xss')
const express = require('express')
const path = require('path')
const Flyers_CategoriesService = require('./Flyers_Categories-Service')

const {requireAuth} = require('../middleware/jwt-auth')

const flyers_CategoriesRouter = express.Router()
const jsonBodyParser = express.json();

const serializeFlyers_Categories = category => ({
    category: category.category
})

flyers_CategoriesRouter
.route('/')
.get((req,res,next)=>{
    
    Flyers_CategoriesService.getFlyers_Categories(req.app.get('db'), req.user.userid)
    .then(categories =>{
        
        res.json(categories.map(serializeFlyers_Categories))
    })
    .catch(next)
})

module.exports = flyers_CategoriesRouter




