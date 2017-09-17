import React, { Component } from "react";

export default class Card extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: false,
      location: null
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(
      {
        selected: !this.state.selected
      },
      () => {
        if (this.state.selected) {
          this.props.onSelect(this.props.index);
        } else {
          this.props.unSelect(this.props.index);
        }
      }
    );
  }
  render() {
    const { title, image, description, googleMapsLink } = this.props;
    const { selected } = this.state;

    let backgroundImage;
    if (selected) {
      backgroundImage = `linear-gradient(
                  to bottom,
                  rgba(249,212,35, 0.8),
                  rgba(255,78,80, 0.9)
                ), url("${image}")`;
    } else {
      backgroundImage = `linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 0.6)
          ), url("${image}")`;
    }
    return (
      <div
        onClick={this.toggle}
        className="card"
        style={{
          backgroundImage,
          height: 350
        }}
      >
        <img
          src="check-w.png"
          className="check"
          style={{ display: selected ? "block" : "none" }}
        />
        <div className="content">
          <a href={googleMapsLink} target="_blank">
            <h2>{title}</h2>
          </a>
          <p>
            {description.length > 70 ? (
              description.substring(0, 70 - 3) + "..."
            ) : (
              description
            )}
          </p>
        </div>
      </div>
    );
  }
}
