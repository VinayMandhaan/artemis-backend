const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
    blocks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'block'
    }],
})

module.exports = Item = mongoose.model('item', ItemSchema)