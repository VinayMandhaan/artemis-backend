const express = require("express");
const Coach = require("../../models/Coach");
const router = express.Router();
const { check, validationResult } = require('express-validator')
const fs = require('fs');
var path = require('path');
const { baseUrl } = require('../../utils/baseUrl')


router.post("/", [
    check('name', 'Name is required').not().isEmpty(),
    check('position', 'Position is required').not().isEmpty(),
    check('email', 'Email is required').not().isEmpty(),
], async (req, res) => {
    const { name, email, academy, position, experience, qualifications } = req.body
    const { file } = req.files

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const newCoach = new Coach({
            name,
            email,
            academy,
            position,
            experience,
            qualifications
        })

        if (file) {
            let r = Math.random().toString(36).substring(7)
            let pathName = `uploads/images/${file.originalFilename.replace(/\s/g, '')}`;
            var stream = await fs.readFileSync(file.path);
            await fs.writeFileSync(path.join(__dirname, `../../${pathName}`), stream)
            newCoach.profile_photo = pathName
        }

        const coach = await newCoach.save()

        return res.json({ coach, status: 200 })
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server Error")
    }
});


router.get('/', async (req, res) => {
    try {
        let coaches = await Coach.find();
        coaches = coaches.map(coach => {

            coach.profile_photo = baseUrl(req) + coach.profile_photo
            return coach
        })
        res.status(200).json({ coaches });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});






module.exports = router