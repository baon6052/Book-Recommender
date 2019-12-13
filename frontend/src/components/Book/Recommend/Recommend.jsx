import React, { useState } from "react";

import load_img from "../../../resources/images/loading.svg";

import classes from "./Recommend.css";
import { Modal, Header, Loader, Dimmer } from "semantic-ui-react";
import Book from "../Book";

import axios from "axios";

const Recommend = props => {
  const [books, setBooks] = useState([]);
  const [modalVisible, showModal] = useState(false);
  const [progressVisible, showProgress] = useState(false);

  function getRecommendations(e) {
    e.preventDefault();
    showProgress(true);

    axios
      .get("/recommendations", {
        params: {
          user_id: localStorage.getItem("user_id")
        }
      })
      .then(res => {
        // show user's rated books
        setBooks(res.data.books);
        toggleModal();
      })
      .catch(error => {
        console.log(error.res);
      });
  }

  function toggleProgress() {
    showProgress(!progressVisible);
  }

  function toggleModal() {
    showModal(!modalVisible);
    showProgress(false);
  }

  return (
    <div className={classes.container}>
      <a
        className="item"
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
