import { Template }  from 'meteor/templating';

import { Profiles } from '../api/profiles.js';

import './signup.html';

Template.signup.events({
  'submit #new-user'(event) {

    event.preventDefault();

    const target = event.target;

    const updateObj = {
         userId: Meteor.userId(),
         flightFrequency: target.flightFrequency.value,
         carrierPref: target.carrierPref.value,
         homeAirport: target.airportCode.value,
         useremail: target.useremail.value,
         createdAt: new Date()
      }
    console.log(updateObj)
    Meteor.call('createProfile', updateObj)
  }
})
