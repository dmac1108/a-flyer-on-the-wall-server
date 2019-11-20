const xss = require('xss')
const express = require('express')
const path = require('path')
const ChildrenService = require('./Children-Service')

const childrenRouter = express.Router()
const jsonBodyParser = express.json()

const serializeChildren = child => ({
    id: child.id,
    childname: xss(child.childname),
    parentid: child.parentid,
})


childrenRouter
    .route('/')
    .get((req,res, next) => {
        ChildrenService.getAllChildren(req.app.get('db'))
        .then(children =>{
            res.json(children.map(serializeChildren))
        })
        .catch(next)
    })
    .post(jsonBodyParser, (req, res, next) => {
        const {childname} = req.body
        const newChild = {childname}

        if(newChild.childname == null){
            return res.status(400)
            .json({
                error: {
                    message: 'Missing the childname in the request body'
                }
            })
        }
        
        ChildrenService.insertChild(req.app.get('db'), newChild)
        .then(child =>{
            res.status(201)
            .location(path.posix.join(req.originalUrl, `/${child.id}`))
            .json(serializeChildren(child))
        })
    })

    childrenRouter
    .route('/:id')
    .get((req, res, next) =>{
        const {id} = req.params
        ChildrenService.getChildbyId(req.app.get('db'), id)
        .then(child =>{
            if(!child){
                return res.status(404)
                .json({
                    error: {message: 
                    'Child does not exist'}
                })
            }
            res.json(serializeChildren(child))
            next()
        })
        .catch(next)

    })
    childrenRouter
    .route('/parent/:parentid')
    .get((req, res, next) =>{
        const parentid = req.params.parentid
        
        ChildrenService.getAllChildrenByParentId(req.app.get('db'), parentid)
        .then(children =>{
            console.log(children)
            res.json(children.map(serializeChildren))
            next()
        })
        .catch(next)

    })


module.exports = childrenRouter