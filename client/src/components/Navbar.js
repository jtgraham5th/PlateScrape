import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "reactstrap";

var axios = require("axios");

class Navbar extends Component {
  pinterestLogin = () => {
    axios.get("/api/pinterest").then(response => console.log(response));
  };
  render() {
    
    return (
      <div className="navbar-fixed">
        <nav className="z-depth-0">
          <div className="nav-wrapper teal darken-4 pr-4 pl-4">
            <Link
              to="/"
              style={{
                fontFamily: "monospace"
              }}
              className="col s5 brand-logo white-text"
            >
              <FontAwesomeIcon
                icon={["fas", "drumstick-bite"]}
                className="mr-3"
              />
              PlateScrape
            </Link>
            <ul id="nav-mobile" class="right">
              <li>
                <Button
                  onclick={this.pinterestLogin}
                  className="mr-2"
                  color="danger"
                >
                <FontAwesomeIcon
                icon={["fab", "pinterest"]}
                size="lg"
                className=""
              /></Button>
              </li>
              <li>
                <Button>Logout</Button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}
export default Navbar;
