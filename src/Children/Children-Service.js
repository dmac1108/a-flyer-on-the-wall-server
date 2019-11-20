
const Knex = require("knex")

const ChildrenService = {
    getAllChildren (db){
        return db.select('*').from('children')
    },
    getChildbyId(db, id){
        return db
        .select('*')
        .from('children')
        .where({id})
        .first()
    },
    getAllChildrenByParentId(db, parentid){
        return db
        .select('*')
        .from('children')
        .where('parentid', parentid)
    },
    insertChild(db, newChild){
        
        return db
        .insert(newChild)
        .into('children')
        .returning('*')
        .then(rows =>{
            
            return rows[0]
            
        })
    },
   
        
    
}

module.exports = ChildrenService