import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  actions: {
    edit() {
      this.sendAction('editAction', this.get('setting'));
    },

    delete() {
      this.sendAction('deleteAction', this.get('setting'));
    }
  }
});
