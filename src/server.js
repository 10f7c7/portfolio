const express = require("express");


const app = express();
const port = 3000; // Or any desired port

app.use('/', express.static("./build"));

app.listen(port, "192.168.1.160", () => {
  console.log(`Example app listening on port ${port}`)
})
