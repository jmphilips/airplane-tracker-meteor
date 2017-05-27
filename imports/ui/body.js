import { Template }  from 'meteor/templating';

import { Flights } from '../api/flights.js';

import './body.html';
import './flight.js';

Template.body.helpers({
  flights() {
    return Flights.find({"belongsTo": Meteor.userId()}, { sort: { createdAt: -1 }});
  }
});

Template.body.helpers({
  currentUser: function() {
    return Meteor.userId();
  }
})

Template.body.events({
  'submit .new-flight'(event) {
      event.preventDefault();

      const today = new Date()
      const year = today.getUTCFullYear()
      const month = today.getMonth() + 1
      const day = today.getDate()

      const target = event.target;
      const airlineCode = target.airlineCode.value;
      const flightNumber = target.flightNumber.value;

      Meteor.call('getFlightData', airlineCode, flightNumber )

      target.airlineCode.value = '';
      target.flightNumber.value = '';
  }
})
