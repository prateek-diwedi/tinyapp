const express = require('express');
const app = express();
const PORT = 8080;

// set the view engine to ejs  ****
app.set('view engine', 'ejs');


const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9ssh3u': 'http://www.google.com',
  '7digw6': 'http://www.shanti-enterprises.com'
};

app.get('/', (req, res) => {      // root route
  res.send("Hello World");
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

app.listen(PORT, () => {
  console.log(`Example app listening to port ${PORT}!`)
});