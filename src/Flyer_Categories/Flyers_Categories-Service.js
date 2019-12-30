const Knex = require('knex')

const Flyers_CategoriesService = {
    getFlyers_Categories(db, userid){
        
        return db.select('*').from('flyer_categories')
        .where('parentuserid', userid)
    },
    insertFlyer_Category(db, category){
        
        return db
        .insert(category)
        .into('flyer_categories')
        .returning('*')
        .then(rows =>{
           
            return rows[0]
            
        })

    }

}

module.exports = Flyers_CategoriesService