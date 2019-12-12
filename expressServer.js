const express = require('express');
const app = express();
const PORT = 8080;

/// setting cookies ----->>>>
let cookieParser = require('cookie-parser');
app.use(cookieParser());

// set the view engine to ejs  ****
app.set('view engine', 'ejs');

////// body parser  ------>>>>>>>
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

////// initialising B crypt ---->>>>
const bcrypt = require('bcrypt');

// users data  *******------->>>>
const users = {};


///// generate randon string function  ------>>>>>
const generateRandomString = function(outputLength) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < outputLength; i ++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};


///// function to find the user ---->>>>>>>
function findUser(email) {
  for (let user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return null;
}

//// function to match url with the user id ------->>
function urlsForUser(id) {
  console.log("what is Id in urlsForUser", id);
 for (let shortURL in urlDatabase) {
   console.log("shortURL is =>", shortURL);
   if (urlDatabase[shortURL].username === id) {
    console.log("username is =>", urlDatabase[shortURL].username); 
     return urlDatabase[shortURL];
   }
 }
 return null;
}


/////   getting urls for specific user   --------->>
function geturls(id) {
  let urls = {};
  console.log("what is Id in urlsForUser", id);
 for (let shortURL in urlDatabase) {
   console.log("shortURL is =>", shortURL);
   if (urlDatabase[shortURL].username === id) {
    console.log("username is =>", urlDatabase[shortURL].username); 
     urls[shortURL] = urlDatabase[shortURL];
   }
 }
 return urls;
}



//// url database  ----->>>>>>>
const urlDatabase = {
  shortURL1: {longURL: '', username: ""},
  shortURL2: {longURL: '', username: "" }
};


//// get requests starts from here ...------>>>>

app.get("/hello", (req, res) => {
  let templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

///// urls page
app.get("/urls", (req, res) => {
  //console.log(req.cookies.username);
  const username = req.cookies.username;
  const geturl = geturls(username);
  console.log('urls logedin person ----->>>>>> ', geturl)
  let templateVars = {
    urls: geturl,
    // longURL: urlDatabase,
    username: req.cookies["username"]
  };
    // showing url only if user is signed in ----->>>
    if (req.cookies["username"] && urlsForUser(username) && urlsForUser(username).username === req.cookies.username) {
    longURL = urlsForUser(username).longURL;
    res.render("urls_index", templateVars);
  } else {
    res.render("sign_in", templateVars);
  }
});

/////// urls new page
app.get("/urls/new", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    longURL: urlDatabase,
    username: req.cookies["username"]
  };
  if (req.cookies["username"]) {
  res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
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
    longURL: urlDatabase[req.params.shortURL].longURL,
    username: req.cookies["username"] };
    //console.log("what is templatevars", templateVars)
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let short = req.params.shortURL;
  console.log('SHORTYYYYYYYYY --------->>>>>>>>>>>>', short);
  let longURL = urlDatabase[short].longURL;
  res.redirect(longURL);
});

///// getting new user  ----- Sign UP Page ------->>>>>>.
app.get("/register", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"]
  };
  res.render("sign_up_page", templateVars);
});

///////   Sign IN Page ----->>>>>>
app.get("/login", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"]
  };
  res.render("sign_in", templateVars);
});



//// post requests starts from here...***>>>>>>>

app.post("/urls", (req, res) => {
  let newShortUrl = generateRandomString(6);
  const username = req.cookies.username;
  urlDatabase[newShortUrl] = {};
  urlDatabase[newShortUrl].username = username;
  urlDatabase[newShortUrl].longURL = 'http://' + req.body.longURL;
  res.redirect(`http://localhost:8080/urls/${newShortUrl}`);
  console.log("Data base ----------------------------->>>", urlDatabase);
});

// delete a tiny url from database ---->>>>>
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

// edit a tiny url from database ---->>>>>
app.post("/urls/:shortURL/edit", (req, res) => {
  let shortUrl = req.params.shortURL;
  console.log('Edit: ', req.params.shortURL);
  res.redirect(`/urls/${shortUrl}`);

});


// update button on the tine url show page ----->>>>
app.post("/urls/:shortURL/update", (req, res) => {
  let longUrl = req.body.editURL;
  urlDatabase[req.params.shortURL].longURL = longUrl;
  res.redirect('/urls');
});



//// getting username from cookies && signing in ----->>>>>
app.post("/login", (req, res) => {
  let email = req.body.email;
  let pass = req.body.password;
  const userFound = findUser(email);
  console.log('userFound', userFound);

  if (userFound) {
    console.log('pass', pass);
    if (bcrypt.compareSync(pass, userFound.password)) {
      res.cookie('username', userFound.username);
      res.redirect("/urls/new");
    } else {
      res.status(403).send("password no good!!!!")
    }
  } else { // no user found
    res.status(403).send("user no findy!")
  }
});

//// logging out ----->>>>>
app.post("/urls/signout", (req, res) => {
  res.clearCookie('username');
  res.redirect("/login");
});


/// adding users to our database ------>>>>
// update button on the tine url show page ----->>>>
app.post("/urls/register", (req, res) => {
  let randomId = generateRandomString(4);
  let userName = req.body.username;
  let email = req.body.email;
  let password = bcrypt.hashSync(req.body.password, 10);
  //const hashedPassword = bcrypt.hashSync(password, 10);
  console.log('username: ', userName, 'email: ', email, 'password: ', password);
  //// LOOPING through the emails in server
  for (user in users) {
    let serverMail = users[user].email;
    let userExist = users[user].username
    if (serverMail === email) {
      res.status(400).send('Email already exists!!')
    } 
    if (userExist === userName) {
      res.status(400).send('This cool username is already taken!!! Please try some other name')
    }
  }
  ///////  USER INFO ADDING  ------->>>>>>>
  users[randomId] = {
    username: userName,
    email: email,
    password: password
  };
  res.cookie('username', userName);
  res.redirect('/urls/new');
  console.log('users in database ------->>>>', users);
});




///// listen command for port ------>>>>>>>>>
app.listen(PORT, () => {
  console.log(`Example app listening to port ${PORT}!`);
});