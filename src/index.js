const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 4000;

app.get('/', (req, res) => {
    res.send('yay!');
})

mongoose.connect('mongodb://localhost:27017/instagram')
    .then(() => {
        app.listen(port, () => {
            console.log(`App listening at http://localhost:${port}`)
        });
    });

