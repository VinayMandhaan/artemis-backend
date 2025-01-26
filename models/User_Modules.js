const mongoose = require('mongoose')

const UserModuleSchema = new mongoose.Schema({

    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'member'
    },
    modules: [
        {
            moduleId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'module',
            },
            submodules: [
                {
                    submoduleId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'sub_module',
                    },
                    completed: {
                        type: Boolean,
                        default: false
                    }
                }
            ]
        }
    ],
})

module.exports = UserModule = mongoose.model('user_module', UserModuleSchema)