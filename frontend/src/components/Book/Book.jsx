import React, { useEffect, useState } from "react";

import classes from "./Book.css";
import { Rating } from "semantic-ui-react";

const Book = props => {
  const [rating, setRating] = useState(props.rating);

  return (
    <div className={classes.container}>
      <div className={classes.img_container}>
        <img src={props.book_img} className={classes.book_img} />

        <div className={classes.book_info}>
          <p className={classes.book_name}> {props.book_name} </p>
          <p className={classes.book_authour}> {props.book_authour} </p>
          <Rating
            className="ui star rating"
            rating={rating}
            maxRating={5}
            onRate={(_, data) => {
              setRating(data.rating);

              console.log(data.rating);
            }}
            clearable
          />
        </div>
      </div>
    </div>
  );
};

export default Book;
