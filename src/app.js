require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const {CLIENT_ORIGIN} = require('./config');
const helmet = require('helmet');
const {NODE_ENV} = require('./config');
const childrenRouter = require('../src/Children/Children-Router')
const flyersRouter = require('../src/Flyers/Flyers-Router')
const flyers_childrenRouter = require('../src/Flyers_Children/Flyers_Children-Router')
const flyers_childrenRouter_Child = require('../src/Flyers_Children/Flyers_Children-ChildRouter')
const flyers_childrenRouter_Flyer = require('../src/Flyers_Children/Flyers_Children-FlyerRouter')
const categoriesRouter = require('./Categories/Categories-Router');
const flyers_CategoriesRouter = require('./Flyer_Categories/Flyers_Categories-Router')
const usersRouter = require('./Users/Users-Router')
const authRouter = require('./auth/auth-router')

const app = express();

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors({
    origin: CLIENT_ORIGIN
}));

app.get('/', (req,res) => {
    res.send('Hello, world!')
});

app.use('/api/users', usersRouter)
app.use('/api/children', childrenRouter)
app.use('/api/flyers', flyersRouter)
app.use('/api/flyers_children', flyers_childrenRouter)
app.use('/api/flyers_children/child', flyers_childrenRouter_Child)
app.use('/api/flyers_children/flyer', flyers_childrenRouter_Flyer)
app.use('/api/categories', categoriesRouter)
app.use('/api/flyers_categories', flyers_CategoriesRouter)
app.use('/api/auth', authRouter)

app.use(function errorHandler(error, req, res, next){
    let response
    if(NODE_ENV === 'production') {
        response = {error: {message: 'server error'}}
    }
    else {
        console.error(error)
        response = {message: error.message}
    }
    response.status(500).json(response)
})

module.exports = app;
