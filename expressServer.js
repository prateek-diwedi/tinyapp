const express = require('express');
const app = express();
const PORT = 8080;

/// setting cookies ----->>>>
let cookieParser = require('cookie-parser');
app.use(cookieParser());

// set the view engine to ejs  ****
app.set('view engine', 'ejs');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// users data  *******------->>>>

const users = {};


const generateRandomString = function(outputLength) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';


  for (let i = 0; i < outputLength; i ++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  //console.log("six digit code: ", result);
  return result;
};

// const emailLookupFromServer = function() {
// for (let user in users) {
//   let mail = users[user].email;
//   let password1 = users[user].password;
//   let nameOfUser = users[user].username;
//   let final = mail, password1, nameOfUser;
//   console.log('final: ', final);
//   return final

// }
// }


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
  res.redirect(`http://localhost:8080/urls/${newShortUrl}`);
  urlDatabase[newShortUrl] = 'http://' + req.body.longURL;

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
  urlDatabase[req.params.shortURL] = longUrl;
  res.redirect('/urls');
});

function findUser(email) {
  for (let user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return null;
}

//// getting username from cookies && signing in ----->>>>>
app.post("/login", (req, res) => {
  let email = req.body.email;
  let pass = req.body.password;
  const userFound = findUser(email);
  console.log('userFound', userFound);

  if (userFound) {
    console.log('pass', pass);
    if (userFound.password === pass) {
      res.cookie('username', userFound.username);
      res.redirect("/urls");
    } else {
      res.status(403).send("password no good!!!!")
    }
  } else { // no user found
    res.status(403).send("user no findy!")
  }
  // for (let user in users) {
  //   let mail = users[user].email;
  //   let password1 = users[user].password;
  //   let nameOfUser = users[user].username;
  // //emailLookupFromServer();
  //   if (email === mail && pass === password1) {
  //     res.cookie('username', nameOfUser);
  //     res.redirect("/urls");
  //   } else {
  //     let templateVars = {
  //       username: req.cookies["username"],
  //       loginFailed: true
  //     };
  //     res.render("sign_in", templateVars);
  //   }
  // }
});

//// logging out ----->>>>>
app.post("/urls/signout", (req, res) => {
  res.clearCookie('username');
  res.redirect("/urls");
});


/// adding users to our database ------>>>>
// update button on the tine url show page ----->>>>
app.post("/urls/register", (req, res) => {
  let randomId = generateRandomString(4);
  let userName = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  console.log('username: ', userName, 'email: ', email, 'password: ', password);
  //// LOOPING through the emails in server
  for (user in users) {
    let serverMail = users[user].email;
    if (serverMail === email) {
      res.status(400).send('Email already exists!!')
    } 
  }
  ///////  USER INFO ADDING  ------->>>>>>>
  users[randomId] = {
    username: userName,
    email: email,
    password: password
  };
  res.cookie('username', userName);
  res.redirect('/urls');
});


///// listen command fof port ------>>>>>>>>>
app.listen(PORT, () => {
  console.log(`Example app listening to port ${PORT}!`);
});