import React, { useEffect, useState } from "react";

import classes from "./Menu.css";
import axios from "axios";
import Recommend from "../Book/Recommend/Recommend";
import Books from "../../pages/Books/Books";
import { useToasts } from "react-toast-notifications";

const Menu = props => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const { addToast } = useToasts();

  useEffect(() => {
    axios
      .get("/books", {
        params: {
          user_id: localStorage.getItem("user_id")
        }
      })
      .then(res => {
        // show user's rated books
        setBooks(res.data.books);

        addToast("Welcome! " + localStorage.getItem("username"), {
          appearance: "success",
          autoDismiss: true
        });
      })
      .catch(error => {
        console.log(error.res);
      });
  }, []);

  const logout = () => {
    props.history.push("/");

    addToast("Bye! See you again.", {
      appearance: "success",
      autoDismiss: true
    });
  };

  const getRatedBooks = () => {
    axios
      .get("/get_rated", {
        params: {
          user_id: localStorage.getItem("user_id")
        }
      })
      .then(res => {
        // show user's rated books
        setBooks(res.data.books);
      })
      .catch(error => {
        console.log(error.res);
      });
  };

  const getAllBooks = () => {
    axios
      .get("/books", {
        params: {
          user_id: localStorage.getItem("user_id")
        }
      })
      .then(res => {
        // show user's rated books
        setBooks(res.data.books);
      })
      .catch(error => {
        console.log(error.res);
      });
  };

  const searchForBook = e => {
    setSearch(e.target.value);

    axios
      .get("/search", {
        params: {
          search_input: e.target.value.trim()
        }
      })
      .then(res => {
        // show user's rated books
        console.log(res.data.books);
        setBooks(res.data.books);
      })
      .catch(error => {
        console.log(error.res);
      });
  };

  return (
    <div className={classes.container}>
      <div className="ui secondary menu">
        <a className="item" id={classes.home} onClick={getAllBooks}>
          Home
        </a>

        <a className="item" id={classes.ratings} onClick={getRatedBooks}>
          Your Ratings
        </a>

        <Recommend className="item" id={classes.recommendations} />

        <div className="right menu">
          <div className="item">
            <div className="ui icon input">
              <input
                type="text"
                onChange={searchForBook}
                id={classes.search}
                placeholder="Search..."
              />
              <i aria-hidden="true" className="search icon"></i>
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
