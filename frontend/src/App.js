import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button } from "semantic-ui-react";
import classes from "./App.css";

import Books from "./pages/Books/Books";
import Menu from "./components/Menu/Menu";

function App() {
  return (
    <div className={classes.Container}>
      <Menu />

      <Books />
    </div>
  );
}

export default App;
