const knex = require('knex')

const CategoriesService = {
    getAllCategories(db){
        return db.raw('Select unnest(enum_range(null::category))' ).then(result => {
            return result.rows[0].unnest})
            .catch((err)=>{console.log(err); throw err})
            .finally(()=>{
                db.destroy();
            });

    },
    insertNewCategory(db, newCategory){
        return db.raw(`ALTER TYPE category ADD VALUE '${newCategory}'`)
        .then(result => {return newCategory})
        .catch((err) =>{console.log(err); throw err})
        .finally(()=>{
            db.destroy();
        })
    }

}

module.exports = CategoriesService