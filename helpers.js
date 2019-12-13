const getUserByEmail = function (email, database) { 
  for (user in database) {
    if ( database[user].email === email) {
      //console.log(email);
      return database[user].id
    }
  }
  return null;
}



module.exports = { getUserByEmail };