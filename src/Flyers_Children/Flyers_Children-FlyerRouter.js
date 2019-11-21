const xss = require('xss')
const express = require('express')
const path = require('path')
const Flyers_ChildrenService = require('./Flyers_Children-Service')
const {requireAuth} = require('../middleware/basic-auth')

const flyers_childrenRouter_Flyer = express.Router()
const jsonBodyParser = express.json()

const serializeFlyer_Children = flyer_child => ({
    id: flyer_child.id,
    childid: flyer_child.childid,
    flyerid: flyer_child.flyerid,
    
})

flyers_childrenRouter_Flyer
.route('/:flyerid')
.all(requireAuth)
.all((req, res, next) =>{
    const flyerid = req.params.flyerid
    Flyers_ChildrenService.getFlyers_ChildrenByFlyerId(req.app.get('db'), flyerid)
    .then(flyers_child=>{

        if(!flyers_child){
            return res.status(404)
            .json({
                error: {message: 
                'There are no children for this flyer or the flyer does not exist'}
            })
        }

        res.flyers_child = flyers_child
        next()
    })
})
.get((req,res,next)=>{
    
    res.flyers_child.length > 1 ?
        res.json(res.flyers_child.map(serializeFlyer_Children)):
        res.json(serializeFlyer_Children(res.flyers_child))
})
.delete((req,res,next)=>{
    const flyerid = req.params.flyerid
    Flyers_ChildrenService.deleteFlyers_ChildrenByFlyerId(req.app.get('db'), flyerid)
    .then(()=>{
        res.status(204).end()
    })
    .catch(next)
})



module.exports = flyers_childrenRouter_Flyer