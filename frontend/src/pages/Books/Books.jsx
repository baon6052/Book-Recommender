import React, { useEffect, useState } from "react";
import "semantic-ui-css/semantic.min.css";

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
      console.log(res);
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

  console.log(books);

  return (
    <div className={classes.book_list}>
      {books.map(book => {
        return (
          <Book
            key={book.book_id}
            book_name={book.original_title}
            book_authour={book.authors}
            book_img={book.image_url}
          />
        );
      })}

      <button class="ui primary button" onClick={handleClick}>
        Activate Lasers
      </button>
    </div>
  );
};

export default Books;
