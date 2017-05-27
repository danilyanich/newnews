
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const data = require('./data.js');
const auth = require('./auth.js');


const app = express();
const port = process.env.PORT || 2579;


const errors = {
    internal: {
        msg: 'Internal Error',
        code: 505
    },
    notfound: {
        msg: 'Not Found',
        code: 404
    },
    invalid: {
        msg: 'Invalid',
        code: 400
    },
    forbidden: {
        msg: 'Forbidden',
        code: 403
    }
};

const writeError = (res, kind, error) => {
    res.writeHead(kind.code);
    res.write(kind.msg);
    res.write(`${error}`);
    res.end();
};

const jsonify = (res, obj) => {
    res.json(obj);
    res.end();
};


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, '../public')));


app.get('/posts', (req, res) =>
    data.getMultiple(req.query)
    .then(pairs => jsonify(res, pairs))
    .catch(err =>
        writeError(res, errors.internal, err))
);

app.get('/posts/:id', (req, res) =>
    data.getById(req.params.id)
    .then(article => jsonify(res, article))
    .catch(err =>
        writeError(res, errors.notfound, err))
);

app.get('/user/:username', (req, res) =>
    auth.getUserData(req.params.username)
    .then(user => jsonify(res, user))
    .catch(err =>
        writeError(res, errors.invalid, err))
);


app.post('/upload', (req, res) =>
    Promise.resolve(req.body).then(article => {
        article.createdAt = new Date(article.createdAt);
        return data.add(`${+Date.now()}`, article);
    })
    .then(id => jsonify(res, { id: id }))
    .catch(err =>
        writeError(res, errors.invalid, err))
);


app.patch('/upload/:id', (req, res) =>
    Promise.resolve(req.body).then(article => {
        article.createdAt = new Date(article.createdAt);
        return data.add(req.params.id, article);
    })
    .then((id, article) => jsonify(res, { id: id, article: article }))
    .catch(err =>
        writeError(res, errors.invalid, err))
);


app.put('/login', (req, res) =>
    auth.authorize(req.body.username, req.body.password)
    .then(user => jsonify(res, user))
    .catch(err =>
        writeError(res, errors.invalid, err))
);


app.put('/goodbye', (req, res) => {
    res.write('see u soon!');
    res.end();
});


app.listen(port, error => {
    if (!error) {
        console.log(`App running on port ${port}`);
        console.log(`http://localhost:${port}`);
    }
});
