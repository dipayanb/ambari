import Ember from 'ember';

export default Ember.Component.extend({
  name: '',
  actions: {
    confirm() {
      this.sendAction('yes');
    },

    cancel() {
      this.sendAction('no');
    }
  }
});
