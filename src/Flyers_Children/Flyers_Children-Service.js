const knex = require('knex')

const Flyers_ChildrenService = {
    getAllFlyers_Children(db){
        return db.select('*').from('flyers_children')
    },
    getFlyers_ChildrenByChildId(db, id){
        return db.select('*').from('flyers_children')
        .where('childid', id)
        .first()
    },
    getFlyers_ChildrenByFlyerId(db, id){
        return db.select('*').from('flyers_children')
        .where('flyerid', id)
        .first()
    },
    insertFlyers_Children(db, newFlyers_Children){
        console.log(newFlyers_Children)
        return db
        .insert(newFlyers_Children)
        .into('flyers_children')
        .returning('*')
        .then(rows =>{    
            return rows[0]
        })
    },
    deleteFlyers_ChildrenByFlyerId(db, id){
        return db('flyers_children')
        .where('flyerid', id)
        .del()
    },
    deleteFlyers_ChildrenByChildId(db, id){
        return db('flyers_children')
        .where('childid', id)
        .del()
    },
}

module.exports = Flyers_ChildrenService