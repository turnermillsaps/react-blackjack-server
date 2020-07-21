const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./models');
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Uncomment to set up whitelist for localhost testing
const whitelist = ['http://localhost:3000']
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}
app.use(cors(corsOptions)) 

// Routes
// ** Test express server
app.get("/", (req, res) => {
    res.send("Server connected")
})

// ** Create user if it does not already exist, otherwise return user data
app.post("/api/findOrCreateUser", (req, res) => {
    console.log(`Request body: ${JSON.stringify(req.body)}`)
    if (!req.body.email || !req.body.name || !req.body.imageUrl || !req.body.googleId) {
        res.json({ ...req.body, error: `Request does not contain all parameters needed.`})
    } else {
        db.user.findOrCreate({
            where: { googleId: req.body.googleId },
            defaults: {
                email: req.body.email,
                name: req.body.name,
                imageUrl: req.body.imageUrl,
                googleId: req.body.googleId
            }
        }).then(result => { 
            res.json(result)
        }).catch(err => {
              console.error(err)
              res.send('An error occurred while attempting to find or create user.')
          })
    } 
})

// ** Get game data from the db
app.get("/api/getUserGameData/:id", (req, res) => {
    console.log(JSON.stringify(req.params))
    db.sequelize.query(`SELECT SUM(money_won_loss), COUNT(id) FROM user_games WHERE user_id = ${req.params.id}`)
        .then(result => {
            console.log(`Game Data: ${JSON.stringify(result[0][0])}`)
            res.json(result[0][0]);
        }).catch(err => { 
            console.error(err)
            res.send(err)
        })
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