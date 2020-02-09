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
      <div></div>
    )
  }
}
export default Navbar;
