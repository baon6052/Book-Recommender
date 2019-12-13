import React, { useState } from "react";

import classes from "./Book.css";
import { Rating } from "semantic-ui-react";
import axios from "axios";
const Book = props => {
  const [rating, setRating] = useState(props.rating);

  const addRating = new_rating => {
    axios
      .post("/add_rating", {
        user_id: localStorage.getItem("user_id"),
        book_id: props.book_id,
        rating: new_rating
      })
      .then(res => {
        console.log("set rating successfully");
      })
      .catch(error => {
        console.log(error.res);
        console.log("Unable to make rating");
      });
  };

  return (
    <div className={classes.container}>
      <div className={classes.img_container}>
        <img src={props.book_img} className={classes.book_img} />
        <div className={classes.book_info}>
          <p className={classes.book_name}> {props.book_name} </p>
          <p className={classes.book_author}> {props.book_author} </p>
          <Rating
            className="ui star rating"
            rating={rating}
            maxRating={5}
            onRate={(_, data) => {
              setRating(data.rating);
              addRating(data.rating);
            }}
            clearable
          />
        </div>
      </div>
    </div>
  );
};

export default Book;
