import React, { useEffect, useState } from "react";

import load_img from "../../../resources/images/loading.svg";

import classes from "./Recommend.css";
import {
  Modal,
  Rating,
  Header,
  Progress,
  Button,
  Loader,
  Segment,
  Dimmer
} from "semantic-ui-react";
import Book from "../Book";

import axios from "axios";

const Recommend = props => {
  const [rating, setRating] = useState(props.rating);
  const [books, setBooks] = useState([]);
  const [modalVisible, showModal] = useState(false);
  const [progressVisible, showProgress] = useState(false);
  const [percent, setPercent] = useState(0);

  // useEffect(() => {
  //   axios.get(`/recommendations/15`).then(res => {
  //     setBooks(res.data.books);
  //     console.log(res.data.books);
  //     // showProgress(false);
  //     // showModal(true);
  //   });
  // }, []);

  //Get recommendations
  function getRecommendations(e) {
    e.preventDefault();
    showProgress(true);

    axios
      .get(`/recommendations/` + localStorage.getItem("username"))
      .then(res => {
        console.log(res);
        setBooks(res.data.books);
        showProgress(false);
        showModal(true);
      });

    console.log("The link was clicked.");
  }

  function toggleProgress() {
    setPercent(0);
    showProgress(!progressVisible);
    console.log("toggle progress");
  }

  function toggleModal() {
    showModal(!modalVisible);
    showProgress(false);
    console.log("toggle modal");
  }

  return (
    <div className={classes.container}>
      <a
        class="item"
        id={classes.recommendations}
        onClick={(toggleProgress, getRecommendations)}
      >
        Recommendations
      </a>

      <Modal open={progressVisible} onClose={toggleModal} id={classes.modalImg}>
        <div className={classes.load_img}>
          <img src={load_img} />

          <Dimmer active inverted id={classes.dimmer}>
            <Loader size="medium" id={classes.loader}>
              Fetching Recommendations
            </Loader>
          </Dimmer>
        </div>
      </Modal>
      <Modal open={modalVisible} onClose={toggleModal}>
        <Header icon="browser" content="Your Recommendations" />
        <Modal.Content>
          <div className={classes.book_list}>
            {books.map(book => {
              return (
                <Book
                  key={book.book_id}
                  book_id={book.book_id}
                  book_name={book.original_title}
                  book_authour={book.authors}
                  book_img={book.image_url}
                  rating={book.rating}
                />
              );
            })}
          </div>
        </Modal.Content>
      </Modal>
    </div>
  );
};

export default Recommend;
