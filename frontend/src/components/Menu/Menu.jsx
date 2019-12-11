import React, { useEffect, useState } from "react";

import classes from "./Menu.css";
import { Rating } from "semantic-ui-react";

import Recommend from "../Book/Recommend/Recommend";

const Menu = props => {
  const [rating, setRating] = useState(props.rating);

  return (
    <div className={classes.container}>
      <div className="ui secondary menu">
        <a className="item" id={classes.home}>
          Home
        </a>
        {/* <a className="item " id={classes.ratings}> */}

        <a className="item" id={classes.ratings}>
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
          <a className="item" id={classes.logout}>
            Logout
          </a>
        </div>
      </div>
    </div>
  );
};

export default Menu;
