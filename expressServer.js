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

app.get("/hello", (req, res) => {
  let templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.get("/urls", (req, ren) => {
  let templateVars = { urls: urlDatabase };
  ren.render("urls_index", templateVars);
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hell', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: 'http://www.google.com' };
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening to port ${PORT}!`)
});