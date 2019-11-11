const Knex = require("knex")

const FlyersService = {
    getAllFlyers (db){
        return db.select('*').from('flyers')
    },
    getFlyerbyId(db, id){
        return db
        .select('*')
        .from('flyers')
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
    updateFlyer(db, flyerid, updatedFlyer){
        return db('flyers')
        .where('id', flyerid)
        .update(updatedFlyer)
        
    },
    deleteFlyer(db,flyerid){
        return db('flyers')
        .where('id', flyerid)
        .del()
    }
   
        
    
}

module.exports = FlyersService