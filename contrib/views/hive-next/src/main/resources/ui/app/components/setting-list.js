import Ember from 'ember';

export default Ember.Component.extend({
  settings: [],
  actions: {
    addNewSettings() {
      this.sendAction('newSettings');
    }
  }
});
