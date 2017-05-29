import { Template } from 'meteor/templating';

import { Flights } from '../api/flights.js';

import './flight.html';

Template.flight.events({
  'click .toggle-checked'() {
    Flights.update(this._id, {
      $set: { checked: ! this.checked },
    })
  },
  'click .delete'() {
    Flights.remove(this._id)
  }
})

Template.flight.helpers({
  beforeNow: function(estArrival) {
    return (new Date(estArrival) > new Date() )
  }
})

Template.flight.helpers({
  parseDate: function(dateObj) {

    const date = new Date(dateObj)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes()

    return `${hours}:${leftPadZeros(minutes)} on ${month}/${day}`
  }
})

const leftPadZeros = minutes => {
  return minutes.toString().length < 2 ? `0${minutes}` : `${minutes}`
}
