import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import "./style.css";
import classnames from "classnames";
import {
  Button,
  Card,
  CardBody,
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
import {
  Row,
  Collapsible,
  CollapsibleItem,
  Tabs,
  Tab,
  Icon,
  Collection,
  CollectionItem,
} from "react-materialize";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compareSync } from "bcrypt-nodejs";
// import { CLEAR_ERRORS } from "../../actions/types";
import { setBoards, pinterestAPIBoardRequest } from "../actions";

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
  componentDidMount() {
    const { isAuthenticated, pinterestToken, userId } = this.props.auth;
    const { boards } = this.props.userData;

    //if the user is logged in and boards DO exist
    if (isAuthenticated && boards.length > 0) {
      console.log("logged in user HAS boards");
      this.setState({
        userBoards: boards,
      });
    }
    //if the user is NOT logged in but has a pinterest token and boards in store
    if (!isAuthenticated && pinterestToken && boards.length > 0) {
      console.log("USER not logged in but has boards");
      this.setState({
        userBoards: boards,
      });
    }
  }
  componentDidUpdate = async () => {
    const { isAuthenticated, pinterestToken, userId } = this.props.auth;
    const { boards } = this.props.userData;
    console.log(this.props.auth);
    //if the user is logged in and has a Pinterest Auth Token and no boards exist
    if (isAuthenticated && pinterestToken && boards.length <= 0) {
      console.log("logged in user has no boards");
      await this.props.pinterestAPIBoardRequest(pinterestToken);
      console.log(boards);
    }
    //if the user is logged in and the boards in state do not equal the boards in redux store(props) then update state
    if (isAuthenticated && boards !== this.state.userBoards) {
      console.log("these are not the same");
      this.setState({
        userBoards: boards,
      });
    }

    //if the user is NOT logged in but has a pinterest token and no boards
    if (!isAuthenticated && pinterestToken && boards.length <= 0) {
      console.log("USER not logged and has no boards");
      await this.props.pinterestAPIBoardRequest(pinterestToken);
      this.setState({
        userBoards: boards,
      });
    }
  };

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
    // axios
    //   .get(
    //     `https://api.pinterest.com/v1/boards/${boardID}/pins/?access_token=${this.state.accessToken}&fields=id%2Clink%2Cnote%2Curl%2Cattribution%2Cimage%2Cmetadata%2Coriginal_link`
    //   )
    //   .then(
    //     function(response) {
    //       boarddata = response.data.data;
    //       console.log(response.data.data);
    //       this.showPins(boarddata);
    //     }.bind(this)
    //   );
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
      <>
        <Collapsible accordion>
          <CollapsibleItem
            active
            expanded={false}
            icon={<Icon>arrow_drop_down</Icon>}
            header="Pinterest"
            node="div"
            id="collapsible-item"
          >
            {this.state.userBoards.length > 1 ? (
              <Row>
                <Collection id="board-collection" className="col s3">
                  {this.state.userBoards.map((board, i) => (
                    <CollectionItem
                      key={i}
                      id={board.id}
                      onClick={this.displayPins}
                      className="row s12 valign-wrapper user-boards"
                    >
                      {board.name}
                    </CollectionItem>
                  ))}
                </Collection>
              </Row>
            ) : (
              <Row>
                <CollectionItem>No Current Boards</CollectionItem>
              </Row>
            )}
            {/* {this.state.togglePins ? (
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
        )} */}
          </CollapsibleItem>
        </Collapsible>
      </>
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
export default connect(mapStateToProps, {
  setBoards,
  pinterestAPIBoardRequest,
})(Pins);
