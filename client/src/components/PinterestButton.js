import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
var Pinterest = require("../utils/pinterest");
var axios = require("axios");
axios.defaults.withCredentials = true;

const PinterestBtn = () => {
  const credentials = {
    client: {
      id: "5073939286663940267",
      secret: "f88681c57f7d8613522b1f09272c106f1fb1366e1464c80a8718442a19e8d743"
    },
    auth: {
      tokenHost: "https://api.pinterest.com/oauth/"
    }
  };
  function pinterestLogin() {
    // const oauth2 = require("simple-oauth2").create(credentials);

    // const authorizationUri = oauth2.authorizationCode.authorizeURL({
    //   redirect_uri: "http://localhost:3000",
    //   scope: "read_public,write_public",
    //   state: "768uyFys"
    // });
    // console.log(authorizationUri);
    axios
      .get("/api/pinterest")
      .then(response => console.log(response))
      .catch(err => {
        console.log(err);
        alert("Failed to create: " + err.message);
      });
  }

  return (
      <Button color="danger" onClick={pinterestLogin}>
        <FontAwesomeIcon icon={["fab", "pinterest"]} size="lg" className="" />
      </Button>
  );
};

export default PinterestBtn;
