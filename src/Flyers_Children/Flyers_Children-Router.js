const xss = require('xss')
const express = require('express')
const path = require('path')
const Flyers_ChildrenService = require('./Flyers_Children-Service')
const ChildrenService = require('../Children/Children-Service');
const FlyersService = require('../Flyers/Flyers-Service')
const {requireAuth} = require('../middleware/jwt-auth')

const flyers_childrenRouter = express.Router()
const jsonBodyParser = express.json({limit: '50MB'})

const serializeFlyer_Children = flyer_child => ({
    id: flyer_child.id,
    childid: flyer_child.childid,
    flyerid: flyer_child.flyerid,
    
})

flyers_childrenRouter
.route('/')
.all(requireAuth)
.get((req, res, next)=>{
    Flyers_ChildrenService.getAllFlyers_Children(req.app.get('db'))
    .then(flyer_children =>{
        res.json(flyer_children.map(serializeFlyer_Children))
    }

    )
    .catch(next)
})
.post(jsonBodyParser, (req, res, next)=>{
    
    let newFlyerChildren = []
    req.body.map((flyerChild) =>{
    // const {childid, flyerid} = req.body
    const {childid, flyerid} = flyerChild
    const newFlyer_Child = {childid, flyerid}
    
    
    ChildrenService.getChildbyId(req.app.get('db'), childid)
    .then(child =>{
        if(!child){
            return res.status(404)
            .json({
                error:{
                    message: 'Child not found'
                }
            })
        }
        
    })
    .catch(next)

    FlyersService.getFlyerbyId(req.app.get('db'), flyerid)
    .then(flyer =>{
        if(!flyer){
            return res.status(404)
            .json({
                error:{
                    message: 'Flyer not found'
                }
            })
        }
    })
    .catch(next)

    newFlyerChildren.push(newFlyer_Child)
})

    Flyers_ChildrenService.insertFlyers_Children(req.app.get('db'), newFlyerChildren)
    .then(newFlyer_Child=>{
        res.status(201)
        .location(path.posix.join(req.originalUrl, `/${newFlyer_Child.id}`))
        .json(newFlyer_Child.map(serializeFlyer_Children))
    })
    .catch(next)
        
    });






module.exports = flyers_childrenRouter