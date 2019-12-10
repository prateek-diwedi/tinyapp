const express = require('express');
const app = express();
const PORT = 8080;

// set the view engine to ejs  ****
app.set('view engine', 'ejs');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


function generateRandomString(outputLength) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';


  for (let i = 0; i < outputLength; i ++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  //console.log("six digit code: ", result);
  return result;
}



const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9ssh3u': 'http://www.google.com',
};

// const bodyParser = require("body-parser");
// app.use(bodyParser.urlencoded({extended: true}));

app.get("/hello", (req, res) => {
  let templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.get("/urls", (req, ren) => {
  let templateVars = { urls: urlDatabase };
  ren.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  let newShortUrl = generateRandomString(6)
  console.log('Short URL: ', newShortUrl)
  //res.send(newShortUrl);         // Respond with 'Ok' (we will replace this)
  res.redirect(`http://localhost:8080/urls/${newShortUrl}`)
  urlDatabase[newShortUrl] = 'http://' +req.body.longURL;
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hell', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  // const longURL = ...
  short = req.params.shortURL;
  longURL = urlDatabase[short];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening to port ${PORT}!`)
});