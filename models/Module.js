const mongoose = require('mongoose')


const SubModuleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    isVideo: {
        type: Boolean
    }
});

const ModuleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    sub_modules: [SubModuleSchema],

})

module.exports = Module = mongoose.model('module', ModuleSchema)