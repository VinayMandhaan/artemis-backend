const express = require("express");
const Blocks = require("../../models/Blocks");
const router = express.Router();
const fs = require('fs');
var path = require('path');
const { check, validationResult } = require('express-validator')
const { baseUrl } = require('../../utils/baseUrl')


router.post("/", [
    check('title', 'Title is required').not().isEmpty(),
    check('type', 'Type is required').not().isEmpty()
], async (req, res) => {
    const { title, description, type } = req.body;
    const { file } = req.files
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const newBlock = new Blocks({
            title,
            description,
            type
        })
        if (file) {
            let r = Math.random().toString(36).substring(7)
            let pathName = `uploads/images/${file.originalFilename.replace(/\s/g, '')}`;
            var stream = await fs.readFileSync(file.path);
            await fs.writeFileSync(path.join(__dirname, `../../${pathName}`), stream)
            newBlock.icon = pathName
        }
        const block = await newBlock.save();
        return res.json({ block, status: 200 });
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server Error");
    }
})


router.get('/', async (req, res) => {
    try {
        let blocks = await Blocks.find();
        blocks = blocks.map(block => {

            block.icon = baseUrl(req) + block.icon
            return block
        })
        res.status(200).json({ blocks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




module.exports = router