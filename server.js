const express = require("express");
const connectDB = require("./config/db");
const path = require('path')
var multipart = require('connect-multiparty');
var cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
    express.json({
        extended: false,
    })
);
app.use(cors());
app.use(multipart());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }))

connectDB();

app.get("/", (req, res) => {
    res.send("API Running");
});

app.get("/uploads/images/:name", (req, res) => {
    res.sendFile(path.join(__dirname, `./uploads/images/${req.params.name}`));
});

app.use('/api/blocks', require('./routes/api/blocks'))
app.use('/api/items', require('./routes/api/items'))
app.use('/api/module', require('./routes/api/module'))


app.listen(PORT, () => {
    console.log(`Server Started on Port ${PORT}`);
});
