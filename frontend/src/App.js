import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button } from "semantic-ui-react";
import classes from "./App.css";

import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Books from "./pages/Books/Books";

import Login from "./components/login/login";
import Book from "./components/Book/Book";
import Menu from "./components/Menu/Menu";

function App() {
  return (
    <Router>
      <div className={classes.Container}>
        <Route exact path="/login" component={Login} />
        {/* <Route exact path="/main" component={Books} /> */}
        <Route exact path="/main" component={Menu} />
        {/* <Menu />

        <Books /> */}
      </div>
    </Router>
  );
}

export default App;
