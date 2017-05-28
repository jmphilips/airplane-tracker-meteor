import '../imports/api/flights.js';
import '../settings.json'

import { Flights } from '../imports/api/flights.js';
import { Profiles } from '../imports/api/profiles.js';

ServiceConfiguration.configurations.remove({
    service: "facebook"
});

ServiceConfiguration.configurations.insert({
    service: "facebook",
    appId: Meteor.settings.FACEBOOK_APP_ID,
    secret: Meteor.settings.FACEBOOK_SECRET
});

Meteor.methods({
  getFlightData(airline, flightNum, destinationCode) {
    HTTP.get(queryString(airline, flightNum), (error, response) => {
      parsedResponse = JSON.parse(response.content)
        if(response.statusCode == 200 && parsedResponse.flightStatuses != null) {
          makeFlightRecord(parsedResponse, destinationCode)
        }
    })
  }
})

const makeFlightRecord = (flightObject, destinationCode) => {

  const airlineName = flightObject.appendix.airlines[0].name
  const airlineCode = flightObject.appendix.airlines[0].fs

  const flightStatuses = flightObject.flightStatuses

  flightStatuses.forEach((flightStatus) => {
    const destination = flightStatus.arrivalAirportFsCode
    console.log(flightStatus)
    if (destination === destinationCode) {
      const flightNumber = flightStatus.flightNumber
      const departure = flightStatus.departureAirportFsCode
      let actualGateArrival = null;
      let estimatedArrival = null;  

      if (flightStatus.operationalTimes.estimatedGateArrival != null) {
        estimatedArrival = flightStatus.operationalTimes.estimatedGateArrival.dateUtc
      } else {
        estimatedArrival = flightStatus.operationalTimes.estimatedRunwayArrival.dateUtc
      }

      const scheduledArrival = flightStatus.operationalTimes.publishedArrival.dateUtc

      if (flightStatus.operationalTimes.actualGateArrival != null) {
        actualGateArrival = flightStatus.operationalTimes.actualGateArrival.dateUtc
      }

      Flights.insert({
        belongsTo: Meteor.userId(),
        airlineName: airlineName,
        airlineCode: airlineCode,
        flightNumber: flightNumber,
        destination: destination,
        departure: departure,

        estimatedArrival: estimatedArrival,
        scheduledArrival: scheduledArrival,
        actualGateArrival: actualGateArrival,
        createdAt: new Date()
      })
    }
  })
}

const queryString = (airline, flightNum) => {
  const appid = Meteor.settings.FLIGHT_APP_ID
  const apikey = Meteor.settings.FLIGHT_API_KEY

  const today = new Date()
  const month = today.getMonth() + 1
  const day = today.getDate()
  const year = today.getFullYear()

  return `https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/${airline}/${flightNum}/arr/${year}/${month}/${day}?appId=${appid}&appKey=${apikey}&utc=false`
}

Meteor.methods({
  createProfile(obj) {
    Profiles.insert(obj)
  }
})