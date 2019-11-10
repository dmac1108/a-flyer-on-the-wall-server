const xss = require('xss')
const express = require('express')
const path = require('path')
const FlyersService = require('./Flyers-Service')

const flyersRouter = express.Router()
const jsonBodyParser = express.json()

const serializeFlyers = flyer => ({
    id: flyer.id,
    title: xss(flyer.title),
    //image: flyer.flyerimage,
    location: xss(flyer.eventlocation),
    eventstartdate: flyer.eventstartdate,
    eventenddate: flyer.eventenddate,
    actiondate: flyer.actiondate,
    action: xss(flyer.flyeraction),
    category: flyer.category,
    
})


flyersRouter
    .route('/')
    .get((req,res, next) => {
        FlyersService.getAllFlyers(req.app.get('db'))
        .then(flyer =>{
            res.json(flyer.map(serializeFlyers))
        })
        .catch(next)
    })
    // .post(jsonBodyParser, (req, res, next) => {
    //     const {childname} = req.body
    //     const newChild = {childname}

    //     if(newChild.childname == null){
    //         return res.status(400)
    //         .json({
    //             error: {
    //                 message: 'Missing the childname in the request body'
    //             }
    //         })
    //     }
        
    //     ChildrenService.insertChild(req.app.get('db'), newChild)
    //     .then(child =>{
    //         res.status(201)
    //         .location(path.posix.join(req.originalUrl, `/${child.id}`))
    //         .json(serializeChildren(child))
    //     })
    // })

    // childrenRouter
    // .route('/:id')
    // .get((req, res, next) =>{
    //     const {id} = req.params
    //     ChildrenService.getChildbyId(req.app.get('db'), id)
    //     .then(child =>{
    //         if(!child){
    //             return res.status(404)
    //             .json({
    //                 error: {message: 
    //                 'Child does not exist'}
    //             })
    //         }
    //         res.json(serializeChildren(child))
    //         next()
    //     })
        //.catch(next)

    //})


module.exports = flyersRouter