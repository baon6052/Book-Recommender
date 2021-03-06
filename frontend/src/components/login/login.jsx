import React, { useState } from "react";
import loginImg from "../../resources/images/login.png";
import { ToastProvider, useToasts } from "react-toast-notifications";

import classes from "./login.css";
import axios from "axios";
const Login = props => {
  const { addToast } = useToasts();

  const [username, setUsername] = useState("");

  const assignUsername = e => {
    setUsername(e.target.value);
  };

  // check if username exists
  // if exists then redirect otherwise output error message to signup
  const login = e => {
    e.preventDefault();
    if (username.trim() != "") {
      axios
        .get("/login", {
          params: {
            username: username
          }
        })
        .then(res => {
          props.history.push("/main");
          localStorage.setItem("user_id", res.data.user_id);
          localStorage.setItem("username", username);
          //   addToast("Welcome! " + username, {
          //     appearance: "success",
          //     autoDismiss: true
          //   });
        })
        .catch(error => {
          addToast("Sorry! Username Not Found", {
            appearance: "warning",
            autoDismiss: true
          });
        });
    } else {
      addToast("Please Enter Valid Username!", {
        appearance: "warning",
        autoDismiss: true
      });
    }
  };

  const register = () => {
    if (username.trim() != "") {
      axios
        .post("/register", {
          username: username
        })
        .then(res => {
          props.history.push("/main");
          localStorage.setItem("user_id", res.data.user_id);

          localStorage.setItem("username", username);
        })
        .catch(error => {
          addToast("Sorry! Username already exists", {
            appearance: "warning",
            autoDismiss: true
          });
        });
    } else {
      addToast("Please Enter Valid Username!", {
        appearance: "warning",
        autoDismiss: true
      });
    }
  };

  const handleKey = e => {
    if (e.key === "Enter") {
      login();
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.border}>
        <div className={classes.header}>Login</div>
        <div className={classes.content}>
          <form className="ui form" onSubmit={login}>
            <div className={classes.image}>
              <img src={loginImg} />
            </div>

            <div className="field" id={classes.username_input}>
              <label id={classes.username_label}>Username</label>
              <input
                value={username}
                onChange={assignUsername}
                placeholder="Username"
              />
            </div>
          </form>

          <div className={classes.footer}>
            <button
              className="ui button"
              onClick={login}
              id={classes.submit_btn}
            >
              Login
            </button>

            <button
              className="ui button"
              onClick={register}
              id={classes.register_btn}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
