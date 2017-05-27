import '../imports/api/flights.js';
import '../settings.json'

import { Flights } from '../imports/api/flights.js';


ServiceConfiguration.configurations.remove({
    service: "facebook"
});

ServiceConfiguration.configurations.insert({
    service: "facebook",
    appId: Meteor.settings.FACEBOOK_APP_ID,
    secret: Meteor.settings.FACEBOOK_SECRET
});

Meteor.methods({
  getFlightData(airline, flightNum) {
    HTTP.get(queryString(airline, flightNum), (error, response) => {
      parsedResponse = JSON.parse(response.content)
        if(response.statusCode == 200 && parsedResponse.flightStatuses != null) {
          makeFlightRecord(parsedResponse)
        }
    })
  }
})

const makeFlightRecord = flightObject => {

  const airlineName = flightObject.appendix.airlines[0].name
  const airlineCode = flightObject.appendix.airlines[0].fs

  const flightStatus = flightObject.flightStatuses[0]
  const flightNumber = flightStatus.flightNumber

  const destination = flightStatus.arrivalAirportFsCode
  const departure = flightStatus.departureAirportFsCode

  const estimatedArrival = flightStatus.operationalTimes.estimatedGateArrival.dateUtc
  const scheduledArrival = flightStatus.operationalTimes.publishedArrival.dateUtc
  const actualGateArrival = flightStatus.operationalTimes.actualGateArrival.dateUtc

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

const queryString = (airline, flightNum) => {
  const appid = Meteor.settings.FLIGHT_APP_ID
  const apikey = Meteor.settings.FLIGHT_API_KEY

  const today = new Date()
  const month = today.getMonth() + 1
  const day = today.getDate()
  const year = today.getFullYear()

  return `https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/${airline}/${flightNum}/arr/${year}/${month}/${day}?appId=${appid}&appKey=${apikey}&utc=false`
}

