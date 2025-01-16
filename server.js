const express = require("express");
const connectDB = require("./config/db");
var cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
    express.json({
        extended: false,
    })
);
app.use(cors());

connectDB();

app.listen(PORT, () => {
    console.log(`Server Started on Port ${PORT}`);
});
