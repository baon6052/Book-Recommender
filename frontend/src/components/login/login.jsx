import React, { useEffect, useState } from "react";
import loginImg from "../../resources/images/login.png";

import classes from "./login.css";
import { Route, Redirect } from "react-router-dom";

const Login = props => {
  const [username, setUsername] = useState("");

  const assignUsername = e => {
    setUsername(e.target.value);
  };

  // check if username exists
  // if exists then redirect otherwise output error message to signup
  const login = () => {
    if (username.trim() != "") {
      console.log("in login func");
      props.history.push("/main");
      localStorage.setItem("username", username);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.border}>
        <div className={classes.header}>Login</div>
        <div className={classes.content}>
          <form class="ui form" onSubmit={login}>
            <div className={classes.image}>
              <img src={loginImg} />
            </div>

            <div class="field" id={classes.username_input}>
              <label id={classes.username_label}>Username</label>
              <input
                value={username}
                onChange={assignUsername}
                placeholder="Username"
              />
            </div>
          </form>

          <div className={classes.footer}>
            <button class="ui button" onClick={login} id={classes.submit_btn}>
              Login
            </button>

            <button class="ui button" onClick={login} id={classes.register_btn}>
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
