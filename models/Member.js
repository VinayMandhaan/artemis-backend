const mongoose = require('mongoose')

const MemberSchema = new mongoose.Schema({
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
    coach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'coach'
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Member = mongoose.model('member', MemberSchema)