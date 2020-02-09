import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "reactstrap";
import PinterestBtn from "./PinterestButton";

var axios = require("axios");

const Navbar = props => {
  return (
    <div className="navbar-fixed">
      <nav className="z-depth-0">
        <div className="nav-wrapper teal darken-4 pr-4 pl-4">
          <Link
            to="/"
            style={{
              fontFamily: "monospace"
            }}
            className="s5 brand-logo white-text"
          >
            <FontAwesomeIcon
              icon={["fas", "drumstick-bite"]}
              className="mr-3"
            />
            PlateScrape
          </Link>
          <ul id="nav-mobile" className="right">
              <li>
                <PinterestBtn />
              </li>
            <li>
              <Button>Logout</Button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
