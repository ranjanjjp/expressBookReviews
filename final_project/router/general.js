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
public_users.get("/", async function (req, res) {
    try {
      const getBooks = () => {
        return new Promise((resolve, reject) => {
          resolve(books);
        });
      };
  
      const bookList = await getBooks();
  
      res.status(200).json({
        message: "Successfully listed books.",
        data: bookList,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve books" });
    }
});
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = parseInt(req.params.isbn);
  
    const getBookByISBN = new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject("Book not found");
      }
    });
  
    getBookByISBN
      .then((book) => {
        res.status(200).json(book);
      })
      .catch((err) => {
        res.status(404).json({ message: err });
      });
});
  
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
  
    const getBooksByAuthor = () => {
      return new Promise((resolve, reject) => {
        const booksByAuthor = Object.values(books).filter((book) => book.author === author);
        if (booksByAuthor.length > 0) {
          resolve(booksByAuthor);
        } else {
          reject("No books found by this author");
        }
      });
    };
  
    try {
      const books = await getBooksByAuthor();
      res.status(200).json(books);
    } catch (err) {
      res.status(404).json({ message: err });
    }
});
  

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
  
    const getBooksByTitle = () => {
      return new Promise((resolve, reject) => {
        const booksByTitle = Object.values(books).filter((book) => book.title === title);
        if (booksByTitle.length > 0) {
          resolve(booksByTitle);
        } else {
          reject("No books found with this title");
        }
      });
    };
  
    try {
      const books = await getBooksByTitle();
      res.status(200).json(books);
    } catch (err) {
      res.status(404).json({ message: err });
    }
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
