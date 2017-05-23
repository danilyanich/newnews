
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const data = require('./data.js');


const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, '../public')));


app.get('/post', (req, res) => {
    data.getMultiple(req.query)
    .then(pairs => {
        res.json(pairs);
        res.end();
    })
    .catch(reason => {
        res.writeHead(500);
        res.write('Internal Error');
        res.end();
    });
});


app.get('/post/:id', (req, res) => {
    let article = data.getById(res.params.id);
    if (article) {
        res.json(article);
        res.end();
    } else {
        res.writeHead(404);
        res.write('NOT FOUND');
        res.end();
    }
});


app.listen(port, error => {
    if (!error)
        data.example();
});
