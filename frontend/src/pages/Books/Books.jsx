import React, { useEffect, useState } from "react";

import axios from "axios";
import classes from "./Books.css";

import Book from "../../components/Book/Book";
import Menu from "../../components/Menu/Menu";
import Recommend from "../../components/Book/Recommend/Recommend";

const Books = props => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    setBooks(props.books);
  });

  // useEffect(() => {
  //   fetch("/books").then(response =>
  //     response.json().then(data => {
  //       setBooks(data.books);
  //     })
  //   );
  // }, []);

  // Get recommendations
  // function handleClick(e) {
  //   e.preventDefault();

  //   axios.get(`/recommendations/15`).then(res => {
  //     console.log(res);
  //     setBooks(res.data.books);
  //   });

  //   console.log("The link was clicked.");
  // }

  // console.log("books", books);

  return (
    <div className={classes.container}>
      {/* <Menu history={props.history} loadRatings={getRatedBooks} /> */}
      {/* <Recommend /> */}
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
