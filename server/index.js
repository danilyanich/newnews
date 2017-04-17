
const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static('docs'));

app.listen(port, (error) => {
  if (error) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
});
