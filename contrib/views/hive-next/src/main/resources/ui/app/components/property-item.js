import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',

  didInsertElement() {
    Ember.run.later( () => {
      this.$('input')[0].focus();
    });
  },


  actions: {
    edit() {
      this.set('property.editing', true);
      Ember.run.later(() => {
        this.$('input')[0].focus();
      });
    },

    delete() {
      this.sendAction('propertyItemDeleted', this.get('property'));
    }
  }
});
