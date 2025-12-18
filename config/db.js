const mongoose = require('mongoose')

function connectToDB(){
        mongoose.connect(process.env.Mongo_URL).then(()=>{
            console.log(" DB IS CONNECTED ");
        })
}

module.exports = connectToDB;