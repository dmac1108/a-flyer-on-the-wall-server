const Knex = require("knex")

const FlyersService = {
    getAllFlyers (db){
        return db.select('*').from('flyers').leftJoin('flyers_children', 'flyers.id', 'flyers_children.flyerid')
.leftJoin('children', 'flyers_children.childid', 'children.id')
    },
    getFlyerbyId(db, id){
        return db
        .select('*')
        .from('flyer')
        .where({id})
        .first()
    },
    insertFlyer(db, newFlyer){
        
        return db
        .insert(newFlyer)
        .into('flyers')
        .returning('*')
        .then(rows =>{
            
            return rows[0]
            
        })
    },
   
        
    
}

module.exports = FlyersService