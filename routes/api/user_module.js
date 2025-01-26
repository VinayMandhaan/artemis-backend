

const express = require("express")
const Member = require("../../models/Member")
const Module = require("../../models/Module")
const router = express.Router()
const { check, validationResult } = require('express-validator')
const fs = require('fs')
var path = require('path')
const { baseUrl } = require('../../utils/baseUrl')
const User_Modules = require("../../models/User_Modules")



router.get('/', async (req, res) => {
    try {
        const newMembers = await User_Modules.find().populate('member').populate('modules.moduleId')
        const count = await User_Modules.aggregate([
            {
                $addFields: {
                    completedCount: {
                        $size: {
                            $filter: {
                                input: { $arrayElemAt: ["$modules.submodules", 0] }, // Assuming `modules.submodules` is an array
                                as: "submodule",
                                cond: { $eq: ["$$submodule.completed", true] }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    completedCount: 1 // Only include the completedCount field
                }
            }
        ])

        let members = {
            data: newMembers,
            count
        }
        res.status(200).json({ members: members })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})



module.exports = router