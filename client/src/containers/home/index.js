import React, { useState, useEffect } from "react";
import "./style.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Row, Icon, Button } from "react-materialize";
import { Modal, ModalBody, ModalHeader, Alert } from "reactstrap";
import Fridge from "../../components/Fridge";
import ShoppingList from "../../components/ShoppingList";
import RecipeList from "../../components/RecipeList";
import MealPlanner from "../../components/MealPlanner";
import MyRecipes from "../../components/MyRecipes";
// import Pins from "../../components/Pins";
import { useSelector, useDispatch } from "react-redux";
import * as ActionCreators from "../../state/store";
import { bindActionCreators } from "redux";

const Home = () => {
  const userData = useSelector((state) => state.userData);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const {
    // logoutUser,
    // loginUser,
    // storeAuthToken,
    loadUser,
    getAuthToken,
  } = bindActionCreators(ActionCreators, dispatch);

  const [modal, setModal] = useState({
    trigger: false,
    state: null,
    title: null,
    message: null,
  });

  useEffect(() => {
    let vh = window.innerHeight * 0.01;

    document.documentElement.style.setProperty("--vh", `${vh}px`);

    window.addEventListener("resize", () => {
      // We execute the same script as before
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    });

    // Load User Data
    if (auth.isAuthenticated && localStorage.getItem("jwtToken")) {
      loadUser(localStorage.getItem("jwtToken"));

      // -- GET AUTHORIZATION CODE --
      let params = new URLSearchParams(window.location.href);
      let pinterestAuthCode = params.get("code");
      const { isAuthenticated, pinterestToken } = auth;

      //if user is logged in and does NOT have a pinterest auth Token
      if (isAuthenticated && !pinterestToken && pinterestAuthCode) {
        console.log("user has no pinterest token");
        getAuthToken(pinterestAuthCode);
      }

      //if user is logged in and does have a pinterest auth Token
      if (isAuthenticated && pinterestToken) {
        console.log("user already has a pinterest Token");
      }

      //if user is NOT logged in and does NOT have a pinterest auth Token
      if (!isAuthenticated && !pinterestToken && pinterestAuthCode) {
        console.log(
          "user is NOT logged in and does not have a pinterest Token"
        );
        getAuthToken(pinterestAuthCode);
      }
    }
  });

  const renderModal = (modalData) => {
    setModal(modalData);
  };

  return (
    <Router>
      <Switch>
        <Route
          exact
          path="/"
          render={() => <RecipeList modal={renderModal} />}
        />
        <Route exact path="/my-list" component={ShoppingList} />
        <Route exact path="/my-kitchen" component={Fridge} />
        <Route
          exact
          path="/my-recipes"
          render={() => <MyRecipes modal={renderModal} />}
        />
      </Switch>
      <Alert
        color="info"
        isOpen={modal.trigger}
        toggle={() =>
          setModal({ trigger: false, state: null, title: null, message: null })
        }
      >
        <b>{modal.title}</b>
        {modal.message}
      </Alert>
      <Row className="bottom-navbar">
        <Link to="/my-recipes">
          <Button flat node="button" waves="light">
            <Icon>menu_book</Icon>{" "}
          </Button>
        </Link>
        <Link to="/">
          <Button flat node="button" waves="light">
            <Icon>home</Icon>{" "}
          </Button>
        </Link>
        <Link to="/my-list">
          <Button flat node="button" waves="light">
            <Icon>list</Icon>{" "}
          </Button>
        </Link>
        <Link to="/my-kitchen">
          <Button flat node="button" waves="light">
            <Icon>kitchen</Icon>{" "}
          </Button>
        </Link>
        <Link to="/search">
          <Button flat node="button" waves="light">
            <Icon>group</Icon>{" "}
          </Button>
        </Link>
      </Row>
      {/* <Modal isOpen={modal.trigger} toggle={() => setModal(!modal.trigger)}>
        <ModalHeader
          toggle={() => setModal(!modal.trigger)}
          className="teal darken-4 white-text"
          style={{ padding: "0.5rem 1rem" }}
        >
          {modal.title}
        </ModalHeader>
        <ModalBody>{modal.message}</ModalBody>
        {/* <ModalFooter className="d-flex justify-content-center">
          <Button
            color="secondary"
            onClick={removeFrmList}
            data-index={i}
            className="mr-4"
          >
            Yes
          </Button>
          <Button color="secondary" onClick={() => setModal(!modal)}>
            No
          </Button>
        </ModalFooter>
      </Modal> */}
    </Router>
  );
};

export default Home;
