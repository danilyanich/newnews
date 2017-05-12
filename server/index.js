
const express = require('express');

const app = express();
const port = 3000;

app.use(express.static('docs'));

app.listen(port, (error) => {
    if (error)
        console.log('something bad happened', error);
    console.log(`server is listening on ${port}`);
});
