const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./models');
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
// ** Test server
app.get("/", (req, res, next) => {
    res.send("Server connected")
})

app.post("/api/getUser", (req, res, next) => {
    
})

// Start server and test db connection 
app.listen(PORT, () => {
    db.sequelize.authenticate()
        .then(() => {
            console.log('Connection server established successfully');
        })
        .catch((err) => {
            console.error(`Server is listening on port ${PORT} but no connection to db: ${err}`);
        })
})