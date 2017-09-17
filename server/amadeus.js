import axios from "axios";

export default class Amadeus {
  constructor(props) {
    this.apiKey = "<API KEY>";
    this.app = props.app;
  }

  pointsOfInterest(req, res) {
    const location = req.body.location;
    const radius = req.body.radius ? req.body.radius : 42;
    const numberOfResults = req.body.numberOfResults
      ? req.body.numberOfResults
      : 20;
    const query = `https://api.sandbox.amadeus.com/v1.2/points-of-interest/yapq-search-circle?apikey=${this
      .apiKey}&latitude=${location.latitude}&longitude=${location.longitude}&radius=${radius}&number_of_results=${numberOfResults}&image_size=small`;
    axios
      .get(query)
      .then(response =>
        res.json({
          pointsOfInterest: response.data.points_of_interest.map(place => {
            return {
              title: place.title,
              image: place.main_image,
              description: place.details.short_description,
              googleMapsLink: place.location.google_maps_link
            };
          })
        })
      )
      .catch(err => {
        console.log(err);
      });
  }
}
