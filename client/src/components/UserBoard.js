import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "reactstrap";

var axios = require("axios");

function UserBoard(props){
  const userBoard = props.userBoard
  let togglePins = false;
  let activeTab = 0;
  let boardPins = [];

  this.pinterestLogin = () => {
    axios.get("/api/pinterest").then(response => console.log(response));
  };  
  this.displayPins = event => {
    event.preventDefault();
    let boardID = event.target.id;
    let boarddata = [];
    console.log(event.target.id);
    togglePins = true;
    axios
      .get(
        `https://api.pinterest.com/v1/boards/${boardID}/pins/?access_token=${this.state.accessToken}&fields=id%2Clink%2Cnote%2Curl%2Cattribution%2Cimage%2Cmetadata%2Coriginal_link`
      )
      .then(
        function(response) {
          boarddata = response.data.data;
          console.log(response.data.data);
          {this.showPins(boarddata)};
        }.bind(this)
      );
    if (activeTab !== event.target.key) {
      activeTab = event.target.key
    }
  };
  this.showPins = boarddata => {
    const requests = boarddata.map((pin, index) => {
      const newPin = {
        id: pin.id,
        image: pin.image.original.url,
        name: !pin.metadata.link ? "Untitled" : pin.metadata.link.title,
        description: !pin.metadata.link
          ? "No Description"
          : pin.metadata.link.description,
        ogLink: pin.original_link
      };
      boardPins.push(newPin);
    });
    Promise.all(requests).then(() => {
      // this.setState({
      //   boardPins
      // });
      // console.log(this.state.boardPins);
    });
  };  
    return (
    <div> 
    <Row
      noGutters={true}
      style={{ backgroundColor: "#333", borderColor: "#333" }}
      className="text-white"
    >
      <h3>Your Boards</h3>
    </Row>
    {props.userBoard.length > 1 ? (
      <Nav tabs className="mt-3">
        {props.userBoard.map((board, i) => (
          <NavItem>
            <NavLink
              key={i}
              id={board.id}
              onClick={this.displayPins}
              className={classnames(
                {
                  active: activeTab === `${i}`
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
      <div className="mx-auto">
        <a
          className="btn btn-danger mx-auto"
          onclick={this.pinterestLogin}
          // href="https://api.pinterest.com/oauth/?response_type=code&redirect_uri=https://serene-plateau-07976.herokuapp.com/&client_id=5073939286663940267&scope=read_public,write_public&state=8675309"
        >
          Login to Pinterest
        </a>
      </div>
    )}
    {togglePins ? (
      <TabContent activeTab={activeTab}>
        <TabPane tabId={activeTab}>
          <Row className="row-display bg-light" style={{ height: "200px" }}>
            {boardPins.map((pins, i) => (
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
                          onClick={props.addRecipe}
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
      )}</div>
    );}


export default UserBoard;
