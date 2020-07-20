# React Blackjack Server
Express Server and PostgreSQL Database for the frontend portion of our full stack capstone: <a href="https://github.com/turnermillsaps/react-blackjack">React Blackjack Project</a>
---

##Contents
---
    * Description
    * What I Used
    * Challenges
    * Stretch Goals
    * Database Tables
    * Code Snippets

##Description
---
This a simple Express server API that reads requests from the Blackjack frontend, and reads/writes to the PostgreSQL database accordingly.

When a user signs in, the API receives a request to query the database and get both the user's profile data and game data.

When a user ends a game, the API receives a request to write the amount of money won or lost to the database.

##What I Used
---
    * JavaScript
    * PostgreSQL
    * NodeJS
    * Express
    * Sequelize

##Challenges
---
Games are the most rewarding development projects because they often present so many opportunities beyond the rules of the game itself. 

However, learning from previous projects, a two week time constraint is the biggest challenge to face when attempting to write an entire application.

I kept the server side as simple as I could for that very reason, but I was still met with a few rough problems to solve.

    * Issue 1: Getting Sequelize configured

It turns out even npm modules have code updates and they, too, will run into bugs and configuration discrepancies. I happened to stumble upon a recently released version of Sequelize that suffered from one of these very issues. The models/index.js file that is given out of the box (and assumed to work out of the box), had one line with a slight syntax mistake that caused a reference error and wouldn't run any built in Sequelize function. Luckily, I was, fortunately, not the only one to have seen this, and the answer was in an issue thread on GitHub for the Sequelize repo. 

    * Issue 2: Reading the Sequelize Docs

At my full time job, I spend a very large portion of my time in a PostgreSQL command line running queries by hand, so naturally I struggle with the Sequelize ORM. Moreover, when I know exactly what I need, it can be very difficult to find the Sequelize equivalent in the documentation. In these scenarios, I often turn to Google, or write the raw query if it requires more than a simple SELECT or INSERT statement.

    * Issue 3: Testing Locally VS Production

When finally running the API calls from the frontend portion of the application instead of Postman, I ran into an issue where the express server refused a request from the frontend. Even though the entire test was running on localhost, I received an error in the console saying that the request was blocked by CORS. As a result, I ended up installing the CORS Express middleware and whitelisting localhost.

##Stretch Goals
---
In any game (be it board, video, table top, etc) I love statistics. Due to the lack of time, I was only able to get one stat in and it is the total number of games played. Here's a list of a few I'd like to include:

    * Average time per turn
    * Average time per game
    * Average money gained/lost per game
    * Average money gained/lost per turn
    * Total hours played

Additionally, I really wanted to include online play using SocketIO, but as mentioned before, time got the better of us.

##Database Tables
---

Table to house the user profile data:
```postgres
blackjack=# \d users
                                      Table "public.users"
  Column   |           Type           | Collation | Nullable |              Default
-----------+--------------------------+-----------+----------+-----------------------------------
 id        | integer                  |           | not null | nextval('users_id_seq'::regclass)
 email     | character varying(255)   |           |          |
 createdAt | timestamp with time zone |           | not null |
 updatedAt | timestamp with time zone |           | not null |
 name      | character varying(255)   |           |          |
 imageUrl  | character varying(255)   |           |          |
 googleId  | character varying(255)   |           |          |
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
    "unique_googleId_constraint" UNIQUE CONSTRAINT, btree ("googleId")
Referenced by:
    TABLE "user_games" CONSTRAINT "user_games_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE S
ET NULL
```

Table to house the individual game stats:
```postgres
blackjack=# \d user_games
                                         Table "public.user_games"
     Column     |           Type           | Collation | Nullable |                Default
----------------+--------------------------+-----------+----------+----------------------------------------
 id             | integer                  |           | not null | nextval('user_games_id_seq'::regclass)
 money_won_loss | integer                  |           |          |
 createdAt      | timestamp with time zone |           | not null |
 updatedAt      | timestamp with time zone |           | not null |
 user_id        | integer                  |           |          |
Indexes:
    "user_games_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "user_games_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL
```

##Code Snippets
---

Create user if it does not already exist, otherwise return user data
```javascript
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
```

Get game data from the db
```javascript
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
```

Post game data to db
```javascript
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
```