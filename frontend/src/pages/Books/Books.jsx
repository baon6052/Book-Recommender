import React, { useEffect, useState } from "react";

import classes from "./Books.css";

import Book from "../../components/Book/Book";

const Books = props => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    setBooks(props.books);
  });

  return (
    <div className={classes.container}>
      <div className={classes.book_list}>
        {books.map(book => {
          return (
            <Book
              key={book.book_id}
              book_id={book.book_id}
              book_name={book.original_title}
              book_author={book.authors}
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
