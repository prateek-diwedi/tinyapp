const express = require('express');
const app = express();
const PORT = 8080;

/// setting cookies ----->>>>
var cookieParser = require('cookie-parser')
app.use(cookieParser())

// set the view engine to ejs  ****
app.set('view engine', 'ejs');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


const generateRandomString = function(outputLength) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';


  for (let i = 0; i < outputLength; i ++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  //console.log("six digit code: ", result);
  return result;
};



const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9ssh3u': 'http://www.google.com',
};

 //// get requests starts from here ...------>>>>

app.get("/hello", (req, res) => {
  let templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.get("/urls", (req, ren) => {
  console.log(req.cookies.username);
  let templateVars = {
     urls: urlDatabase,
     username: req.cookies["username"]
  };
  ren.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
 };
  res.render("urls_new", templateVars);
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hell', (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
 };
  res.send('<html><body>Hello <b>World</b></body></html>\n');
  res.render(templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL], 
    username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  // const longURL = ...
  let short = req.params.shortURL;
  let longURL = urlDatabase[short];
  res.redirect(longURL);
});



//// post requests starts from here...***>>>>>>>

app.post("/urls", (req, res) => {
  let newShortUrl = generateRandomString(6);
  res.redirect(`http://localhost:8080/urls/${newShortUrl}`);
  urlDatabase[newShortUrl] = 'http://' + req.body.longURL;
});

// delete a tiny url from database ---->>>>>
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
})

// edit a tiny url from database ---->>>>>
app.post("/urls/:shortURL/edit", (req, res) => {
  let shortUrl = req.params.shortURL
  console.log('Edit: ', req.params.shortURL);
  res.redirect(`/urls/${shortUrl}`);

})


// update button on the tine url show page ----->>>>
app.post("/urls/:shortURL/update", (req, res) => {
  let longUrl = req.body.editURL;
  urlDatabase[req.params.shortURL] = longUrl;
  res.redirect('/urls');
})

//// getting username from cookies ----->>>>>
app.post("/urls/signIn", (req, res) => {
let nameOfUser = req.body.username;
console.log('User Name: ', nameOfUser);
res.cookie('username', nameOfUser);
res.redirect("/urls");
});

//// logging out ----->>>>>
app.post("/urls/signout", (req, res) => {
  //let nameOfUser = req.body.username;
  //console.log('User Name to signout: ', nameOfUser);
  res.clearCookie('username');
  res.redirect("/urls");
  });

// let templateVars = {
//   username: req.cookies["username"],
//   // ... any other vars
// };  
// console.log('user name for func: ', username);
// res.render("urls_index", templateVars);

///// listen command fof port ------>>>>>>>>>
app.listen(PORT, () => {
  console.log(`Example app listening to port ${PORT}!`);
});