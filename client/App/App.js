import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Masonry from "react-masonry-infinite";
import shortid from "shortid";
import Card from "./Card";
import Fab from "./Fab";
import { CSSTransitionGroup } from "react-transition-group";
import Suggestion from "./Suggestion";

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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMore: true,
      elements: null,
      position: null,
      numSelected: 0,
      selected: [],
      suggesting: false,
      suggestions: []
    };

    this.loadMore = this.loadMore.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.unSelect = this.unSelect.bind(this);
    this.submit = this.submit.bind(this);
  }

  loadMore() {
    const { position, elements } = this.state;
    const fetchData = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        location: {
          latitude: position.coords.latitude.toFixed(2),
          longitude: position.coords.longitude.toFixed(2)
        }
      })
    };
    fetch("/api/points-of-interest", fetchData)
      .then(res => {
        return res.json();
      })
      .then(res => {
        this.setState({
          elements: elements.concat(res.pointsOfInterest)
        });
      });
  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        // console.log(position);
        const fetchData = {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            location: {
              latitude: position.coords.latitude.toFixed(2),
              longitude: position.coords.longitude.toFixed(2)
            }
            // numberOfResults: 14
          })
        };
        fetch("/api/points-of-interest", fetchData)
          .then(res => {
            return res.json();
          })
          .then(res => {
            this.setState({
              position: position,
              elements: res.pointsOfInterest
            });
          });
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  onSelect(key) {
    this.state.selected.push(key);

    this.setState({
      numSelected: this.state.numSelected + 1,
      selected: this.state.selected
    });
  }

  unSelect(key) {
    const index = this.state.selected.indexOf(key);
    this.state.selected.splice(index, 1);

    this.setState(
      {
        numSelected: this.state.numSelected - 1,
        selected: this.state.selected
      },
      () => {
        console.log(this.state.selected);
      }
    );
  }

  submit() {
    let locations = [];
    console.log(this.state.selected);
    this.state.elements.forEach((element, index) => {
      locations.push({
        location: element.location,
        isSelected: this.state.selected.indexOf(index) !== -1
      });
    });

    const fetchData = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ locations })
    };

    fetch("/api/location-data", fetchData)
      .then(res => {
        return res.json();
      })
      .then(res => {
        console.log(res);
        this.setState({
          suggestions: res.data,
          suggesting: true,
          elements: null
        });
      });
  }

  render() {
    const {
      elements,
      numSelected,
      position,
      suggesting,
      suggestions
    } = this.state;

    let suggestions_list;
    if (suggesting) {
      suggestions_list = suggestions.map(suggestion => {
        return (
          <Suggestion
            name={suggestion.name}
            lat={suggestion.latitude}
            long={suggestion.longitude}
            image={location.image}
          />
        );
      });
    }

    return (
      <div className="App">
        <h1>
          {suggesting ? (
            "Here are some suggestions"
          ) : (
            "Destination Unknown? Let's find some"
          )}
        </h1>
        <h3>
          {suggesting ? null : (
            "Click on some local places you've visited and liked"
          )}{" "}
        </h3>
        <div className="container">
          <CSSTransitionGroup
            transitionName="example"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
          >
            {elements ? (
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
              >
                {elements.map(
                  ({ title, image, description, googleMapsLink }, i) => (
                    <Card
                      title={title}
                      image={image}
                      description={description}
                      key={i}
                      index={i}
                      onSelect={this.onSelect}
                      unSelect={this.unSelect}
                    />
                  )
                )}
              </Masonry>
            ) : suggesting ? (
              suggestions_list
            ) : null}
          </CSSTransitionGroup>
        </div>
        <Fab
          show={numSelected == 0 || suggesting ? false : true}
          onClick={this.submit}
        />
      </div>
    );
  }
}

export default App;
