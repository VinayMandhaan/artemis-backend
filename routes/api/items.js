
const express = require("express");
const Items = require("../../models/Items");
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { blockIds } = req.body

        const blocks = await Block.find({ '_id': { $in: blockIds } })

        if (blocks.length !== blockIds.length) {
            return res.status(400).json({ message: 'Some blocks were not found' })
        }

        const blockTypes = blocks.map(block => block.type)

        const hasSingle = blockTypes.includes('single')
        const hasGroupped = blockTypes.includes('groupped')

        if (hasSingle && hasGroupped) {
            return res.status(400).json({ message: 'Cannot mix single and groupped blocks' })
        }

        if (hasSingle && blockTypes.filter(type => type === 'single').length > 1) {
            return res.status(400).json({ message: 'Only one single block can be used at a time' })
        }

        const newItem = new Items({
            blocks: blockIds
        })

        await newItem.save()

        res.status(200).json({ message: 'Item created successfully', item: newItem })
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server Error")
    }
})


module.exports = router
