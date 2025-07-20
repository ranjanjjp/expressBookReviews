const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  //Write your code here

  const userName = req.body.username;
  const password = req.body.password;

  if(userName && password) {
    if (!doesExist(userName)) {
            // Add the new user to the users array
            users.push({"username": userName, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    } else {
        // Return error if username or password is missing
        return res.status(404).json({message: "Unable to register user."});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const listBook = JSON.stringify(books, null, 4);
  res.send(listBook);
  return res.status(300).json({message: "Successfully listed books.", data: listBook});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn)

  const getIsbnBook = books[isbn];
res.send(getIsbnBook)
  return res.status(300).json({message: "Fetched book", data: getIsbnBook});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
    const getBookByAuthor = Object.values(books).filter((item) => item.author === author)
    
res.send(getBookByAuthor)
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
    const getBookByTitle = Object.values(books).filter((item) => item.title === title)
    
res.send(getBookByTitle)

  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  const isbn = parseInt(req.params.isbn)

  const getIsbnBook = books[isbn];

  const bookReview = getIsbnBook.reviews;
res.send(bookReview)
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
