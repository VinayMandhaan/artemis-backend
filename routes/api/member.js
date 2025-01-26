const express = require("express")
const Member = require("../../models/Member")
const Module = require("../../models/Module")
const router = express.Router()
const { check, validationResult } = require('express-validator')
const fs = require('fs')
var path = require('path')
const { baseUrl } = require('../../utils/baseUrl')
const User_Modules = require("../../models/User_Modules")


router.post("/", [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('email', 'Email is required').not().isEmpty(),
], async (req, res) => {
    const { name, email, description, program, coach } = req.body
    const { file } = req.files

    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }


        const newMember = new Member({
            name,
            email,
            description,
            program,
            coach
        })

        if (file) {
            let r = Math.random().toString(36).substring(7)
            let pathName = `uploads/images/${file.originalFilename.replace(/\s/g, '')}`
            var stream = await fs.readFileSync(file.path)
            await fs.writeFileSync(path.join(__dirname, `../../${pathName}`), stream)
            newMember.profile_photo = pathName
        }

        const member = await newMember.save()

        return res.json({ member, status: 200 })
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server Error")
    }
})


router.post("/add-modules", [
    check('modules', 'Modules is required').not().isEmpty(),
    check('userId', 'User is required').not().isEmpty(),
], async (req, res) => {
    const { modules, userId } = req.body

    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const moduleDocs = await Module.find({ '_id': { $in: modules } })
        const userDocs = await Member.find({ '_id': { $in: userId } })


        if (moduleDocs.length === 0) {
            return res.status(400).json({ msg: 'No modules found for the provided IDs' })
        }

        if (userDocs.length === 0) {
            return res.status(400).json({ msg: 'No user found for the provided IDs' })
        }


        let newArr = moduleDocs.map((v, i) => {
            return {
                moduleId: v._id,
                submodules: v.sub_modules.map(l => {
                    return {
                        submoduleId: l._id,
                        completed: false
                    }
                })
            }
        })

        const newUserModule = new User_Modules({
            member: userId,
            modules: newArr
        })
        const userModule = await newUserModule.save()

        return res.json({ userModule, status: 200 })
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server Error")
    }
})

router.put('/user-modules/:userId/modules/:moduleId/submodules/:submoduleId', async (req, res) => {
    try {
        const { userId, moduleId, submoduleId } = req.params

        const userModule = await User_Modules.findOne({ 'member': userId }).populate('member').populate('modules.moduleId')

        if (!userModule) {
            return res.status(404).json({ error: 'User module not found' })
        }

        const module = userModule.modules.find(module =>
            module.moduleId._id.toString() === moduleId
        )

        if (!module) {
            return res.status(404).json({ error: 'Module not found' })
        }

        const submodule = module.submodules.find(sub =>
            sub.submoduleId.toString() === submoduleId
        )

        if (!submodule) {
            return res.status(404).json({ error: 'Submodule not found' })
        }

        submodule.completed = true

        await userModule.save()

        res.status(200).json({ message: 'Submodule completed status updated', userModule })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message })
    }
})


router.get('/user-modules/:id', async (req, res) => {
    try {
        const userModule = await User_Modules.find({ 'member': req.params.id }).populate('member').populate('modules.moduleId')
        res.status(200).json({ userModule })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})



router.get('/', async (req, res) => {
    try {
        let members = await Member.find().populate('coach')
        members = members.map(member => {
            member.profile_photo = baseUrl(req) + member.profile_photo
            return member
        })

        res.status(200).json({ members })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})


router.get('/user-modules', async (req, res) => {
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