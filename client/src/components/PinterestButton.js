import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "reactstrap";

// var axios = require("axios");

const PinterestBtn = () => {
  // function pinterestLogin() {
  //   console.log("hit!!");
  //   axios.get("/api/pinterest").then(response => console.log(response));
  // }

  return (
    <a href="https://api.pinterest.com/oauth/?response_type=code&redirect_uri=https://serene-plateau-07976.herokuapp.com/&client_id=5073939286663940267&scope=read_public,write_public&state=8675309">
      <Button color="danger">
        <FontAwesomeIcon icon={["fab", "pinterest"]} size="lg" className="" />
      </Button>
    </a>
  );
};

export default PinterestBtn;
