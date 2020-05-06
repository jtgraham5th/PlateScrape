import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "reactstrap";
import { connect } from "react-redux";
import * as actions from "../actions";


class PinterestBtn extends React.Component {

  pinterestLogin = () => {
      this.props.pinterestLogin()
    };

render(){
  return (
      <Button color="danger" onClick={this.pinterestLogin}>
        <FontAwesomeIcon icon={["fab", "pinterest"]} size="lg" className="" />
      </Button>
  );
};
}
// const mapStatetoProps = () => {

// }

export default connect(null, actions)(PinterestBtn);
