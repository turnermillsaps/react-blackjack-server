const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./models');

const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res, next) => {
    res.send("Server connected")
})

// Once server is listening, test db connection
db.sequelize.authenticate()
        .then(() => {
            console.log('Connection established successfully');
        })
        .catch((err) => {
            console.error('Unable to connect to database: ' + err);
        }) 

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})