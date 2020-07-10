const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const PORT = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res, next) => {
    res.send("Server connected")
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})