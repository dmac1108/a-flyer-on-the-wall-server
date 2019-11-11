function makeChildrenArray(){
    return [
        {
            id: 1,
            childname: "Dick",
        },
        {
            id: 2,
            childname: "Sally",
        },
        {
            id: 3,
            childname: "Jane",
        },
    ]
}
function makeFlyersArray(){
    // var cornMazeBuffer = new Buffer('../src/cornmazebase64.bin', 'base64');
    // var afterSchoolBuffer = new Buffer('../src/afterschoolbase64.bin', 'base64');
    // var campingBuffer = new Buffer('../src/campingbase64.bin', 'base64')

    //var bytea = require('postgres-bytea');
    // const cornmaze =  '\\x' + require('../src/cornmazebase64.bin')
    // const afterschool = '\\x' + require('../src/afterschoolbase64.bin')
    // const camping = '\\x' + require('../src/campingbase64.bin')

    const cornmaze = pg_read_file('../src/Corn-Maze-Flyer.jpg','hex', function(err, imgData){
        console.log(imgData)
        return imgData = '\\x' + imgData;
    })



    return [
        [
            {
                id: 1,
                title: "Corn Maze",
                eventlocation: "Best Corn Maze",
                flyerimage: cornmaze,
                eventstartdate: "10/15/19 15:30",
                eventenddate: "10/15/19 17:00",
                actiondate: "10/10/19",
                flyeraction: "RSVP",
                category: "school",
            },
            {
                id: 2,
                title: "Field Trip",
                eventlocation: "Washington D.C.",
                flyerimage: afterschool,
                eventstartdate: "11/13/19 13:00",
                eventenddate: "11/13/19 15:00",
                actiondate: "9/5/19",
                flyeraction: "Send Permission Slip",
                category: "school",
            },
            {
                id: 3,
                title: "Camping",
                eventlocation: "Camp Lost In the Woods",
                flyerimage: camping,
                eventstartdate: "9/3/19 9:30",
                eventenddate: "9/4/19 10:30",
                actiondate: "8/20/19",
                flyeraction: "Pay",
                category: "school",
            },
        ],
    ]
}


module.exports = {makeChildrenArray, makeFlyersArray}