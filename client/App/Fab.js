import React, { Component } from "react";
import { CSSTransitionGroup } from "react-transition-group";

export default class Fab extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { show } = this.props;
    return (
      <CSSTransitionGroup
        transitionName="example"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
      >
        <div className="fab" style={{ display: show ? "block" : "none" }}>
          <img src="next.png" />
        </div>
      </CSSTransitionGroup>
    );
  }
}
