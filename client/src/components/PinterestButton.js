import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-materialize";
import { connect } from "react-redux";
import * as actions from "../actions";
import axios from "axios";
require("dotenv").config();


class PinterestBtn extends React.Component {
  pinterestLogin = () => {
    axios.get("/api/pinterestLogin").then((response) => console.log(response));
  };
  render() {
    const pinterest = `https://api.pinterest.com/oauth/?response_type=code&redirect_uri=https://serene-plateau-07976.herokuapp.com//&client_id=${process.env.clientId}&scope=read_public,write_public&state=768uyFys`

    return (
      <Button  className="red darken-1" onClick={() => window.location.href=pinterest}>
        <FontAwesomeIcon icon={["fab", "pinterest"]} size="lg" className="" /> Pinterest
      </Button>
    );
  }
}
// const mapStatetoProps = () => {

// }

export default connect(null, actions)(PinterestBtn);
