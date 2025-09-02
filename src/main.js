const express = require("express");


const path = require('path');
const app = express();
const port = 3000; // Or any desired port


app.use('/', express.static(path.join(__dirname, 'public')));

//TODO: make program run and auto compile on save using `npm-watch`

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
