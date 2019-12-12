import React, { useEffect, useState } from "react";
import loginImg from "../../resources/images/login.png";

import classes from "./login.css";
import { Route, Redirect } from "react-router-dom";

const Register = props => {
  const [username, setUsername] = useState("");

  const assignUsername = e => {
    setUsername(e.target.value);
  };

  // check if username exists
  // if exists then redirect otherwise output error message to signup
  const Register = () => {
    props.history.push("/main");
    localStorage.setItem("username", username);
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>Register</div>
      <div className={classes.content}>
        <form class="ui form">
          <div className={classes.image}>
            <img src={loginImg} />
          </div>

          <div class="field">
            <label>Username</label>
            <input
              value={username}
              onChange={assignUsername}
              placeholder="Username"
            />
          </div>
        </form>
      </div>

      <div className={classes.footer}>
        <button class="ui button" onClick={login}>
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Register;
