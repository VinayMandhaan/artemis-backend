const express = require("express");
const Module = require("../../models/Module");
const router = express.Router();
const { check, validationResult } = require('express-validator')


router.post("/", [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('sub_modules', 'Sub-modules must be an array').isArray().optional(),
], async (req, res) => {
    const { title, description, sub_modules } = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const newModule = new Module({
            title,
            description,
            sub_modules: sub_modules || []
        })

        const module = await newModule.save()

        return res.json({ module, status: 200 })
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server Error")
    }
});

router.get('/', async (req, res) => {
    try {
        const modules = await Module.find()
        res.status(200).json(modules)
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving modules', err })
    }
});




module.exports = router