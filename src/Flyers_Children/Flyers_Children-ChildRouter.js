const xss = require('xss')
const express = require('express')
const path = require('path')
const Flyers_ChildrenService = require('./Flyers_Children-Service')

const flyers_childrenRouter_Child = express.Router()
const jsonBodyParser = express.json()

const serializeFlyer_Children = flyer_child => ({
    id: flyer_child.id,
    childid: flyer_child.childid,
    flyerid: flyer_child.flyerid,
    
})

flyers_childrenRouter_Child
.route('/:childid')
.get((req, res, next) =>{
    const childid = req.params.childid
    Flyers_ChildrenService.getFlyers_ChildrenByChildId(req.app.get('db'), childid)
    .then(flyers_child=>{

        if(!flyers_child){
            return res.status(404)
            .json({
                error: {message: 
                'There are no flyers for this child or the child does not exist'}
            })
        }

        flyers_child.length > 1 ?
        res.json(flyers_child.map(serializeFlyer_Children)):
        res.json(serializeFlyer_Children(flyers_child))
    })
})
.delete((req,res,next)=>{
    const childid = req.params.childid
    Flyers_ChildrenService.deleteFlyers_ChildrenByChildId(req.app.get('db'), childid)
    .then(()=>{
        res.status(204).end()
    })
    .catch(next)
})

module.exports = flyers_childrenRouter_Child