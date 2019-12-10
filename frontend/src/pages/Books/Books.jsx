import React, { useEffect, useState } from "react";

import axios from "axios";
import classes from "./Books.css";

import Book from "../../components/Book/Book";

const Books = props => {
  const [books, setBooks] = useState([]);

  // useEffect(() => {
  //   fetch("/books").then(response =>
  //     response.json().then(data => {
  //       setBooks(data.books);
  //     })
  //   );
  // }, []);

  useEffect(() => {
    axios.get(`/books`).then(res => {
      // console.log(JSON.parse(res.data));

      setBooks(res.data.books);
    });
  }, []);

  // Get recommendations
  function handleClick(e) {
    e.preventDefault();

    axios.get(`/recommendations/15`).then(res => {
      console.log(res);
      setBooks(res.data.books);
    });

    console.log("The link was clicked.");
  }

  console.log("books", books);

  return (
    <div className={classes.container}>
      <button class="ui primary button" onClick={handleClick}>
        Recommendations
      </button>

      <div className={classes.book_list}>
        {books.map(book => {
          return (
            <Book
              key={book.book_id}
              book_name={book.original_title}
              book_authour={book.authors}
              book_img={book.image_url}
              rating={book.rating}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Books;
