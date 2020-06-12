const express = require("express");
const app = express();
require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressJwt = require("express-jwt");
const cookieParser = require('cookie-parser');
const helmet = require('helmet')

const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(bodyParser.json());

//connect to db
mongoose.connect("mongodb://localhost:27017/ifum",
    { 
        useCreateIndex: true,
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useFindAndModify: false
    },
    (err) => {
        if (err) throw err;
        console.log("Connected to the database");
    }
);

// Verify JWT to authenticate user accessing /api* endpoints
app.use("/api", expressJwt({ secret: process.env.SECRET }));
app.use("/api/spotify", require("./routes/spotify"));

app.use("/auth", require("./routes/auth"));


app.use((err, req, res, next) => {
    console.error(err);
    if (err.name === "UnauthorizedError") {
        res.status(err.status)
    }
    return res.send({ message: err.message });
});

app.listen(PORT, () => {
    console.log(`[+] Starting server on port ${PORT}`);
});