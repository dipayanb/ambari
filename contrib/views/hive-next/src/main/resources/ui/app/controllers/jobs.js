import Ember from 'ember';

export default Ember.Controller.extend({
  moment: Ember.inject.service(),
  queryParams: ['startTime', 'endTime'],
  startTime: null,
  endTime: null,


  startTimeText: Ember.computed('startTime', function() {
    return this.get('moment').moment(this.get('startTime')).format('YYYY-MM-DD');
  }),

  endTimeText: Ember.computed('endTime', function() {
    return this.get('moment').moment(this.get('endTime')).format('YYYY-MM-DD');
  })


});
