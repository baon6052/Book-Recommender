import React from "react";

import classes from "./Book.css";

const Book = props => {
  return (
    <div className={classes.container}>
      <div>
        <img src={props.book_img} className={classes.book_img} />
      </div>

      <div className={classes.book_info}>
        <p className={classes.book_name}> {props.book_name} </p>
        <p className={classes.book_authour}> {props.book_authour} </p>
      </div>
    </div>
  );
};

export default Book;
