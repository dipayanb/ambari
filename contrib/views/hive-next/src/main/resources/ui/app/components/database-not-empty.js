import Ember from 'ember';

export default Ember.Component.extend({
  name: '',

  actions: {
    close() {
      this.sendAction('close');
    }
  }
});
