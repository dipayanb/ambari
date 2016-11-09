import Ember from 'ember';

export default Ember.Service.extend({
  store: Ember.inject.service(),
  initialize: function() {
    this.schedulePing();
  },

  schedulePing() {
    this.get('store').adapterFor('ping').ping();
    Ember.run.later(this.schedulePing.bind(this), 60000);
  }
});
