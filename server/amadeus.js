import axios from "axios";

export default class Amadeus {
  constructor(props) {
    this.amadeusApiKey = process.env.AMADEUS_API_KEY;
    this.facebookAppID = process.env.FACEBOOK_APP_ID;
    this.facebookAppSecret = process.env.FACEBOOK_APP_SECRET;
  }

  pointsOfInterest(req, res) {
    const location = req.body.location;
    const radius = req.body.radius ? req.body.radius : 42;
    const numberOfResults = req.body.numberOfResults
      ? req.body.numberOfResults
      : 20;
    const query = `https://api.sandbox.amadeus.com/v1.2/points-of-interest/yapq-search-circle?apikey=${this
      .amadeusApiKey}&latitude=${location.latitude}&longitude=${location.longitude}&radius=${radius}&number_of_results=${numberOfResults}`;
    axios
      .get(query)
      .then(response =>
        res.json({
          pointsOfInterest: response.data.points_of_interest.map(place => {
            return {
              title: place.title,
              image: place.main_image,
              description: place.details.short_description,
              googleMapsLink: place.location.google_maps_link,
              location: place.location
            };
          })
        })
      )
      .catch(err => console.log(err));
  }

  getDataFromLocation(req, res) {
    const locations = req.body.locations;
    const query = (latitude, longitude) =>
      `https://graph.facebook.com/v2.10/current_place/results?coordinates={"latitude":${latitude},"longitude":${longitude}}&fields=checkins,description,engagement,name,overall_star_rating,price_range,rating_count&limit=1&access_token=${this
        .facebookAppID}|${this.facebookAppSecret}`;
    Promise.all(
      locations.map(location =>
        axios.get(query(location.latitude, location.longitude))
      )
    )
      .then(responses =>
        res.json({ responses: responses.map(response => response.data) })
      )
      .catch(err => console.log(err));
  }
}
