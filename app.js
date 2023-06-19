const express = require('express');

const app = express();


app.use((req, res, next) => {
    res.send('<h1>What"s up ');
})

app.listen(3000);