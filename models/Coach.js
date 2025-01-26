const mongoose = require('mongoose')

const CoachSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profile_photo: {
        type: String
    },
    program: {
        type: String
    },
    position: {
        type: String
    },
    experience: {
        type: String
    },
    qualifications: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Coach = mongoose.model('coach', CoachSchema)