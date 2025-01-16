const mongoose = require('mongoose')

const BlockSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String
    },
    icon: {
        type: String
    },
    type: {
        type: String,
        enum: ['single', 'groupped'],
        default: 'single'
    }
})

module.exports = Block = mongoose.model('block', BlockSchema)