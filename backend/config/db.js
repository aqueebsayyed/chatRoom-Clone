const mongoose = require("mongoose")


const connectToDb = async ()=>{
    try {
        await mongoose.connect(process.env.MONGOURL)
        console.log("Database connected successfully");
    } catch (error) {
        console.log("error to connect database" , error)
    }
}


module.exports = connectToDb