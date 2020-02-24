import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
var axios = require("axios");
axios.defaults.withCredentials = true;

const PinterestBtn = () => {
  function pinterestLogin() {
    console.log("hit!!");
    axios.get('/api/pinterest',{withCredentials: true}).then(response => console.log(response)).catch(err => {
      console.log(err);
      alert("Failed to create: " + err.message);
    });;
  }

  return (
    <Button color="danger" onClick={pinterestLogin}>
      <FontAwesomeIcon icon={["fab", "pinterest"]} size="lg" className="" />
    </Button>
  );
};

export default PinterestBtn;
