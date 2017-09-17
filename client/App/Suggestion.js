import React, { Component } from "react";

export default class Suggestion extends Component {
  render() {
    const { name, lat, long, image } = this.props;

    const backgroundImage = `linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0.6)
      ), url(${image})`;

    const backgroundMap = `https://maps.googleapis.com/maps/api/staticmap?center=${lat}%2c%20${long}
    &zoom=12&size=400x400&key=AIzaSyCUWkYt6IF3TfN41KUoPJu-aKm3-tOMoeY
    &markers=color:red%7Clabel:C%7C${lat},${long}`;
    return (
      <div className="suggestion">
        <div className="sug_img" style={{ backgroundImage }}>
          <div className="content-container">
            <h4>{name}</h4>
            <a>Travel information (Coming Soon!)</a>
          </div>
        </div>

        <img className="sug_map" src={backgroundMap} />
      </div>
    );
  }
}
