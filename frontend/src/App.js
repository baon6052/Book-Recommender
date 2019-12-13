import React from "react";
import "./App.css";
import classes from "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { ToastProvider } from "react-toast-notifications";
import Login from "./components/login/login";
import Menu from "./components/Menu/Menu";

function App() {
  return (
    <ToastProvider autoDismiss>
      <Router>
        <div className={classes.Container}>
          <Route exact path="/" component={Login} />
          <Route exact path="/main" component={Menu} />
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
