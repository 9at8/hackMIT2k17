import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Masonry from "react-masonry-infinite";
import shortid from "shortid";
const colors = [
  "#EC407A",
  "#EF5350",
  "#AB47BC",
  "#7E57C2",
  "#5C6BC0",
  "#42A5F5",
  "#29B6F6",
  "#26C6DA",
  "#26A69A",
  "#66BB6A",
  "#9CCC65",
  "#827717",
  "#EF6C00"
];

const heights = [350, 350, 400, 400, 450, 450];

const getRandomElement = array =>
  array[Math.floor(Math.random() * array.length)];

const generateElements = () =>
  [...Array(10).keys()].map(() => ({
    key: shortid.generate(),
    color: getRandomElement(colors),
    height: `${getRandomElement(heights)}px`
  }));

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMore: true,
      elements: generateElements()
    };
  }

  loadMore = () =>
    setTimeout(
      () =>
        this.setState(state => ({
          elements: state.elements.concat(generateElements())
        })),
      2500
    );

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);

        console.log(position.coords);
        const fetchData = {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          })
        };
        fetch("/api/points-of-interest", fetchData).then(res => {
          console.log(res.json());
        });
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
  render() {
    return (
      <div className="App">
        <h1>Destination Unknown? Try our recommendations</h1>
        <div className="container">
          <Masonry
            className="masonry"
            hasMore={this.state.hasMore}
            loader={
              <div className="sk-folding-cube">
                <div className="sk-cube1 sk-cube" />
                <div className="sk-cube2 sk-cube" />
                <div className="sk-cube4 sk-cube" />
                <div className="sk-cube3 sk-cube" />
              </div>
            }
            loadMore={this.loadMore}
          >
            {this.state.elements.map(({ key, color, height }, i) => (
              <div
                key={key}
                className="card"
                style={{ background: color, height }}
              >
                <div className="content">
                  <h2>Test</h2>
                  <p>This is a fancy location.</p>
                </div>
              </div>
            ))}
          </Masonry>
        </div>
      </div>
    );
  }
}

export default App;
