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
app.get("/", (req, res) => {
    res.send("Server connected")
})

// ** Get user data from db
app.get("/api/getUser", (req, res) => {
    let userData = {}
    db.user.findAll({ where: { email: req.body.email }})
        .then(result => { res.json(result) })
        .catch(err => {
            console.error(err)
            res.send('An error occurred while attempting to retrieve user.')
        })
})

// ** Create user if it does not already exist
app.post("/api/createUser", (req, res) => {
    if (!req.body.email || !req.body.name || !req.body.imageUrl || !req.body.googleId) {
        res.json({ ...req.body, error: `Request does not contain all parameters needed.`})
    } else {
        db.user.create({
            email: req.body.email,
            name: req.body.name,
            imageUrl: req.body.imageUrl,
            googleId: req.body.googleId
        }).then(result => { res.json(result) })
          .catch(err => {
            console.error(err)
            res.send('An error occurred while attempting to create user.')
          })
    }
})

// ** Post game data to db
app.post("/api/postGame", (req, res) => {
    if (!req.body.money_won_loss || !req.body.user_id) {
        res.json({ ...req.body, error: `Request does not contain all parameters needed.`})
    } else {
        db.user_games.create({
            money_won_loss: req.body.money_won_loss,
            user_id: req.body.user_id
        })
        .then(result => { res.json(result) })
        .catch(err => {
              console.error(err)
              res.send(err)
          })
    }
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