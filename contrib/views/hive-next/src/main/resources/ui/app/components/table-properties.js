import Ember from 'ember';
import TableProperty from '../models/table-property';

export default Ember.Component.extend({
  properties: [],

  actions: {
    addNewRow() {
      let emptyProperty = TableProperty.create({editing: true});
      this.get('properties').pushObject(emptyProperty);
    },

    itemDeleted(property) {
      this.get('properties').removeObject(property);
    },

    itemUpdated(property) {

    }
  }
});
