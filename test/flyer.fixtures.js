const jwt = require('jsonwebtoken')
const config = require('../src/config')

function makeUsersArray(){
    return [
        {
            userid: 1,
            firstname: 'Jane', 
            lastname: 'Smith',
            email: 'jane.smith@test.com',
            username: 'jsmith',
            user_password: 'apassword'
        },
        {
            userid: 2,
            firstname: 'Anita', 
            lastname: 'Jones',
            email: 'anita.jones@test.com',
            username: 'ajones',
            user_password: 'apassword' 
        },
    ]
}


function makeChildrenArray(){
    return [
        {
            id: 1,
            childname: "Dick",
            parentid: 2,
        },
        {
            id: 2,
            childname: "Sally",
            parentid: 1
        },
        {
            id: 3,
            childname: "Jane",
            parentid: 1
        },
    ]
}

function makeBuffers(filename){
    
    const buffer = require('buffer');
    const path = require('path');
    const fs = require('fs');
    
    let myPromise = new Promise((resolve, reject)=>{
        fs.readFile(path.join(__dirname,'/assets/',filename),function(error,data){
            
            if(error){
            throw error;
            }else{
            var buf = Buffer.from(data);
            base64 = buf.toString('base64');
            
            resolve(base64);
            }
        });
    });
        return myPromise

}

function encodeImageFiles(){
    const cornMaze = makeBuffers('Corn-Maze-Flyer.jpg')
    const camping = makeBuffers('scoutcamping.jpg')
    const afterschool = makeBuffers('after-school-flyer.jpg')

    const encodeImagePromise = Promise.all([cornMaze, camping, afterschool])
    //.then((values)=>resolve(values))
     
    return encodeImagePromise
}

function makeFlyersArray(){
    
    let flyersPromise = new Promise((resolve, reject) =>{
        const imageArray = encodeImageFiles()
        imageArray.then((values) =>{
            
            resolve( [
                {
                    id: 1,
                    title: "Corn Maze",
                    eventlocation: "Best Corn Maze",
                    flyerimage: values[0],
                    eventstartdate: "10/15/19 15:30",
                    eventenddate: "10/15/19 17:00",
                    actiondate: "10/10/19",
                    flyeraction: "RSVP",
                    flyercategory: "school",
                    parentuserid: 1,
                    categoryid: 1,
                },
                {
                    id: 2,
                    title: "Field Trip",
                    eventlocation: "Washington D.C.",
                    flyerimage: values[2],
                    eventstartdate: "11/13/19 13:00",
                    eventenddate: "11/13/19 15:00",
                    actiondate: "9/5/19",
                    flyeraction: "Send Permission Slip",
                    flyercategory: "school",
                    parentuserid: 1,
                    categoryid: 3,
                },
                {
                    id: 3,
                    title: "Camping",
                    eventlocation: "Camp Lost In the Woods",
                    flyerimage: values[1],
                    eventstartdate: "9/3/19 9:30",
                    eventenddate: "9/4/19 10:30",
                    actiondate: "8/20/19",
                    flyeraction: "Pay",
                    flyercategory: "school",
                    parentuserid: 2,
                    categoryid: 2,
                },
            ])


        })

        
    })

    return flyersPromise
        
}

function makeFlyersNoImagesArray(){
    
    return [
                {
                    id: 1,
                    title: "Corn Maze",
                    eventlocation: "Best Corn Maze",
                    flyerimage: '',
                    eventstartdate: "10/15/19 15:30",
                    eventenddate: "10/15/19 17:00",
                    actiondate: "10/10/19",
                    flyeraction: "RSVP",
                    flyercategory: "school",
                    parentuserid: 1
                },
                {
                    id: 2,
                    title: "Field Trip",
                    eventlocation: "Washington D.C.",
                    flyerimage: '',
                    eventstartdate: "11/13/19 13:00",
                    eventenddate: "11/13/19 15:00",
                    actiondate: "9/5/19",
                    flyeraction: "Send Permission Slip",
                    flyercategory: "school",
                    parentuserid: 1
                },
                {
                    id: 3,
                    title: "Camping",
                    eventlocation: "Camp Lost In the Woods",
                    flyerimage: '',
                    eventstartdate: "9/3/19 9:30",
                    eventenddate: "9/4/19 10:30",
                    actiondate: "8/20/19",
                    flyeraction: "Pay",
                    flyercategory: "school",
                    parentuserid: 2
                },
            ]
        }
    
function makeFlyersChildrenArray(){
    return [
        {id: 1, childid: 1, flyerid: 1},
        {id: 2, childid: 2, flyerid: 2},
        {id: 3, childid: 2, flyerid: 3}
    ]
}

function makeFlyerCategoriesArray(){
    return [
        {id: 1, category: 'test1', parentuserid: 1},
        {id: 2, category: 'test2', parentuserid: 2},
        {id: 3, category: 'test3', parentuserid: 1}
    ]
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
      subject: user.username,
      algorithm: 'HS256',
    })
    return `Bearer ${token}`
  }
  


module.exports = {makeUsersArray,makeChildrenArray, makeFlyersArray, makeFlyersNoImagesArray, makeFlyersChildrenArray, makeFlyerCategoriesArray, makeAuthHeader}