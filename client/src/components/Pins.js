import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import "./style.css";
import classnames from "classnames";
import {
  Button,
  Card,
  CardBody,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  CardImg,
  CardTitle,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compareSync } from "bcrypt-nodejs";
// import { CLEAR_ERRORS } from "../../actions/types";
// import { getUserFridgeData } from "../actions/authActions";

var axios = require("axios");

class Pins extends Component {
  state = {
    recipes: [],
    recipelink: "",
    userBoards: [],
    togglePins: false,
    boardPins: [],
    accessToken: "",
    activeTab: 1,
    modal1: false,
    modal2: false,
  };

  componentDidMount = () => {
    // -- GET AUTHORIZATION CODE --
    let params = new URLSearchParams(window.location.href);
    let pinterestAuthCode = params.get("code");
    console.log("pinterestAuthCode", pinterestAuthCode);
    const { isAuthenticated, user } = this.props.auth;
    console.log(user)
    console.log(isAuthenticated)

    //if user is logged in and does not have a pinterest auth code
    if (isAuthenticated && !user.pinterestCode) {
      console.log("user has no pin code")
    }

    //if user is logged in and does have a pinterest auth code
    if (isAuthenticated && user.pinterestCode) {
      console.log("user has pin code")
    }

    //if user is not logged
    if (pinterestAuthCode) {
    axios
      .post(
        `https://api.pinterest.com/v1/oauth/token?grant_type=authorization_code&client_id=5073939286663940267&client_secret=f88681c57f7d8613522b1f09272c106f1fb1366e1464c80a8718442a19e8d743&code=${pinterestAuthCode}`
      )
      .then((response) => {
        console.log(response);
        const accessToken = response.data.access_token;
        console.log("pinterest access Token:", accessToken);
        this.setState({ accessToken: accessToken });
        console.log("ACUTAL TOKEN", accessToken);
        this.pinterestAPIBoardRequest();
      })
      .catch((err) => {
        console.log("ERROR:", err);
        // const accessToken =
        //   "Aj5cBG-EFZy8RRy1skpJ0zVYY_QkFeSnWQ45H_lGakDl-YDIqwJUgDAAAAMgRmtif9EgrmUAAAAA";
        // this.setState({ accessToken: accessToken });
        // console.log("TEMPORARY TOKEN", accessToken);
        // this.pinterestAPIBoardRequest();
      });
  };
};
  pinterestAPIBoardRequest() {
    // --- MAKE A REQUEST ---
    if (this.state.accessToken.length > 1) {
      axios
        .get(
          `https://api.pinterest.com/v1/me/boards/?access_token=${this.state.accessToken}&fields=id%2Cname%2Curl%2Cimage%2Cdescription`
        )
        .then((response) => {
          console.log(response);
          this.setState({
            userBoards: response.data.data,
          });
        })
        .catch((err) => {
          console.log("Error", err);
        });
    }
  }
  componentDidUpdate(props) {
    console.log(props);
    const { isAuthenticated, user } = this.props.auth;
    console.log(user)
    console.log(isAuthenticated)

    //if user is logged in and does not have a pinterest auth code
    if (isAuthenticated && !user.pinterestCode) {
      let params = new URLSearchParams(window.location.href);
      let pinterestAuthCode = params.get("code");
      console.log("pinterestAuthCode", pinterestAuthCode);

      console.log("user has no pin code")
    }

    //if user is logged in and does have a pinterest auth code
    if (isAuthenticated && user.pinterestCode) {
      console.log("user has pin code")
    }
  }
  addRecipe = async (event) => {
    const url = event.target.dataset.url;
    this.setState({ recipelink: url }, () => {
      this.handleFormSubmit(event);
      console.log(this.state.recipelink);
    });
  };
  displayPins = (event) => {
    event.preventDefault();
    let boardID = event.target.id;
    let boarddata = [];
    console.log(event.target.id);
    this.setState({ togglePins: true });
    axios
      .get(
        `https://api.pinterest.com/v1/boards/${boardID}/pins/?access_token=${this.state.accessToken}&fields=id%2Clink%2Cnote%2Curl%2Cattribution%2Cimage%2Cmetadata%2Coriginal_link`
      )
      .then(
        function(response) {
          boarddata = response.data.data;
          console.log(response.data.data);
          this.showPins(boarddata);
        }.bind(this)
      );
    if (this.state.activeTab !== event.target.key) {
      this.setState({ activeTab: event.target.key });
    }
  };
  showPins = (boarddata) => {
    this.setState({
      boardPins: [],
    });
    let boardPins = this.state.boardPins;
    const requests = boarddata.map((pin, index) => {
      const newPin = {
        id: pin.id,
        image: pin.image.original.url,
        name: !pin.metadata.link ? "Untitled" : pin.metadata.link.title,
        description: !pin.metadata.link
          ? "No Description"
          : pin.metadata.link.description,
        ogLink: pin.original_link,
      };
      boardPins.push(newPin);
    });
    Promise.all(requests).then(() => {
      this.setState({
        boardPins,
      });
      console.log(this.state.boardPins);
    });
  };
  toggleModal = (num) => {
    console.log(num, "NUM");
    if (num === 1) {
      this.setState({
        modal1: !this.state.modal1,
      });
    } else if (num === 2) {
      this.setState({
        modal2: !this.state.modal2,
      });
    }
  };
  render(props) {
    return (
      <div className="bg-secondary">
        {this.state.userBoards.length > 1 ? (
          <Nav tabs className="mt-3">
            {this.state.userBoards.map((board, i) => (
              <NavItem>
                <NavLink
                  key={i}
                  id={board.id}
                  onClick={this.displayPins}
                  className={classnames(
                    {
                      active: this.state.activeTab === `${i}`,
                    },
                    "bg-white border-dark"
                  )}
                >
                  {board.name}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        ) : (
          <div></div>
        )}
        {this.state.togglePins ? (
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId={this.state.activeTab}>
              <Row className="row-display bg-light" style={{ height: "200px" }}>
                {this.state.boardPins.map((pins, i) => (
                  <Col md="3" className="text-wrap h-100">
                    <Card key={i} className="h-100">
                      <Row noGutters={true} className="h-100">
                        <Col md="4" className="h-100">
                          <CardImg
                            src={pins.image}
                            alt={pins.name}
                            className="h-100"
                          />
                        </Col>
                        <Col md="8" className="h-100">
                          <CardBody className="p-2 d-flex flex-column h-100">
                            <CardTitle className="h6">{pins.name}</CardTitle>
                            <small>{pins.description}</small>
                            <Button
                              id={pins.id}
                              data-url={pins.ogLink}
                              onClick={this.addRecipe}
                              className="align-self-center mt-2"
                              color="danger"
                            >
                              Add Ingredients
                            </Button>
                            <Modal
                              isOpen={this.state.modal1}
                              toggle={() => this.toggleModal(1)}
                            >
                              <ModalHeader
                                toggle={() => this.toggleModal(1)}
                                className="bg-secondary"
                              >
                                Uh...
                              </ModalHeader>
                              <ModalBody>
                                We are currently unable to scrape this recipe.
                                Try another!
                              </ModalBody>
                              <ModalFooter>
                                <Button
                                  color="secondary"
                                  onClick={() => this.toggleModal(1)}
                                >
                                  close
                                </Button>
                              </ModalFooter>
                            </Modal>
                          </CardBody>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
              </Row>
            </TabPane>
          </TabContent>
        ) : (
          ""
        )}
      </div>
    );
  }
}
Pins.propTypes = {
  auth: PropTypes.object.isRequired,
  userData: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  userData: state.userData,
});
export default connect(mapStateToProps)(Pins);
