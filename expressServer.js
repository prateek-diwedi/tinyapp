const express = require('express');
const app = express();
const PORT = 8080;

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9ssh3u': 'http://www.google.com',
  '7digw6': 'http://www.shanti-enterprises.com'
};

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.listen(PORT, () => {
  console.log(`Example app listening to port ${PORT}!`)
});