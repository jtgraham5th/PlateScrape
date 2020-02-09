import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "reactstrap";

var axios = require("axios");

const PinterestBtn = () => {
  function pinterestLogin(){
    console.log("hit!!")
    axios.get("/api/pinterest").then(response => console.log(response));
  };

  return (
    <Button onClick={pinterestLogin} className="mr-2" color="danger">
      <FontAwesomeIcon icon={["fab", "pinterest"]} size="lg" className="" />
    </Button>
  );
};

export default PinterestBtn;
