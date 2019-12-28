const Knex = require('knex')

const Flyers_CategoriesService = {
    getFlyers_Categories(db, userid){
        
        return db.select('*').from('flyer_categories')
        .where('parentuserid', userid)
    },

}

module.exports = Flyers_CategoriesService