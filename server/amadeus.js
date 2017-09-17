import axios from 'axios'
import fs from 'fs'
import { spawn } from 'child_process'

export default class Amadeus {
  constructor(props) {
    this.amadeusApiKey = process.env.AMADEUS_API_KEY
    this.facebookAppID = process.env.FACEBOOK_APP_ID
    this.facebookAppSecret = process.env.FACEBOOK_APP_SECRET
  }

  pointsOfInterest(req, res) {
    const location = req.body.location
    const radius = req.body.radius ? req.body.radius : 42
    const numberOfResults = req.body.numberOfResults
      ? req.body.numberOfResults
      : 20
    const query = `https://api.sandbox.amadeus.com/v1.2/points-of-interest/yapq-search-circle?apikey=${this
      .amadeusApiKey}&latitude=${location.latitude}&longitude=${location.longitude}&radius=${radius}&number_of_results=${numberOfResults}`
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
            }
          })
        })
      )
      .catch(err => console.log(err))
  }

  getDataFromLocation(req, res) {
    const locations = req.body.locations
    const query = (latitude, longitude) =>
      `https://graph.facebook.com/v2.10/current_place/results?coordinates={"latitude":${latitude},"longitude":${longitude}}&fields=checkins,description,engagement,name,overall_star_rating,price_range,rating_count&limit=1&access_token=${this
        .facebookAppID}|${this.facebookAppSecret}`
    let selectedLocations = []
    Promise.all(
      locations.map(data => {
        selectedLocations.push(data.isSelected)
        return axios.get(query(data.location.latitude, data.location.longitude))
      })
    )
      .then(responses => {
        return responses.map((response, index) => {
          return { data: response.data.data[0], isSelected: selectedLocations[index] }
        })
      })

      // data cleanup
      .then(responses => {
          return responses.reduce((acc, response) => {
            let cleanResponse = {}
            if (response.data) {
              cleanResponse = {
                checkins: response.data.checkins ? response.data.checkins : -900,
                description: Math.round(Math.random() * 10),
                engagement: response.data.engagement ? response.data.engagement.count : -900,
                overallStarRating: response.data.overall_star_rating ? response.data.overall_star_rating * 10 : -900,
                priceRange: response.data.price_range ? response.data.price_range.length : -900,
                ratingCount: response.data.rating_count ? response.data.rating_count : -900,
                isSelected: response.isSelected
              }
            } else {
              cleanResponse = null
            }

            if (cleanResponse) {
              let numberOfDirtyValues = 0
              for (let key in cleanResponse) {
                if (cleanResponse.hasOwnProperty(key) && cleanResponse[key] === -900) {
                  numberOfDirtyValues++
                }
              }

              if (numberOfDirtyValues <= 3) {
                acc.push(cleanResponse)
              }
            }

            return acc
          }, [])
        }
      )

      // .then(cleanResponses => {
      //   let sentimentResponses = []
      //   cleanResponses.forEach(response => {
      //     if (response.description !== -900) {
      //       sentimentResponses.push(indico.sentimentHQ(response.description))
      //     } else {
      //       sentimentResponses.push(-900)
      //     }
      //   })
      //   return { sentimentResponses: Promise.all(sentimentResponses), cleanResponses }
      // })
      //
      // .then(finalResponses => {
      //   console.log(finalResponses.sentimentResponses)
      //   return finalResponses.cleanResponses
      // })

      // Make a csv out of these objects
      .then(cleanResponses => {
        let csvResponses = ''
        let csvDecisions = ''
        cleanResponses.forEach(response => {
          csvResponses += `${response.checkins},${response.description},${response.engagement},${response.overallStarRating},${response.priceRange},${response.ratingCount}\n`
          csvDecisions += `${response.isSelected ? 1 : 0}\n`
        })

        fs.writeFile('/tmp/X.csv', csvResponses, err => {
          if (err) {
            return console.log(err)
          }
          fs.writeFile('/tmp/y.csv', csvDecisions, err => {
            if (err) {
              return console.log(err)
            }
            const child = spawn('/tmp/rec.py y.csv X.csv test.csv')
            child.stdout.on('data', data => console.log(data))
            child.stderr.on('data', data => console.log(data))
          })
        })

        // res.send(csvResponses)
      })
      .catch(err => console.log(err))
  }
}
