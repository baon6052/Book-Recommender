import React, { useEffect, useState } from "react";

import classes from "./Menu.css";
import { Rating } from "semantic-ui-react";
import { Route, Redirect } from "react-router-dom";
import axios from "axios";
import Recommend from "../Book/Recommend/Recommend";
import Books from "../../pages/Books/Books";
import Book from "../Book/Book";

const Menu = props => {
  const [rating, setRating] = useState(props.rating);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get(`/books/` + localStorage.getItem("username")).then(res => {
      // console.log(JSON.parse(res.data));

      setBooks(res.data.books);
    });
  }, []);

  const logout = () => {
    // console.log("went here");
    //    return <Route render={({ history }) => history.Redirect} />;
    // return <Redirect to="/main" />;

    props.history.push("/login");
  };

  const getRatedBooks = () => {
    axios.get(`/rated_books/` + localStorage.getItem("username")).then(res => {
      // console.log(JSON.parse(res.data));

      setBooks(res.data.books);
    });
  };

  const getAllBooks = () => {
    fetch("/books/" + localStorage.getItem("username")).then(response =>
      response.json().then(data => {
        setBooks(data.books);
      })
    );
  };

  return (
    <div className={classes.container}>
      <div className="ui secondary menu">
        <a className="item" id={classes.home} onClick={getAllBooks}>
          Home
        </a>
        {/* <a className="item " id={classes.ratings}> */}

        <a className="item" id={classes.ratings} onClick={getRatedBooks}>
          Your Ratings
        </a>

        <Recommend className="item" id={classes.recommendations} />

        <div className="right menu">
          <div className="item">
            <div className="ui icon input">
              <input type="text" id={classes.search} placeholder="Search..." />
              <i aria-hidden="true" class="search icon"></i>
            </div>
          </div>
          <a className="item" onClick={logout} id={classes.logout}>
            Logout
          </a>
        </div>
      </div>

      <Books books={books} />
    </div>
  );
};

export default Menu;
