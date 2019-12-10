import React from "react";
import logo from "./logo.svg";
import "./App.css";

import classes from "./App.css";

import Books from "./pages/Books/Books";

function App() {
  return (
    <div className={classes.Container}>
      <Books />
    </div>
  );
}

export default App;
