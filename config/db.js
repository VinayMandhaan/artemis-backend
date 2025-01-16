const mongoose = require('mongoose')
const db = 'mongodb+srv://admin:admin@cluster0.2en0m.mongodb.net/'


const connectDB = async () => {
    try{
        await mongoose.connect(db,{
        })
        console.log('MongoDB Connected')
    }catch(err){
        console.log(err.message)
        process.exit(1)
    }
}

module.exports = connectDB