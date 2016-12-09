import Ember from 'ember';
import Column from '../models/column';

export default Ember.Component.extend({
  columns: [],

  actions: {
    addNewColumn() {
      let newEmptyColumn = Column.create({editing: true});
      this.get('columns').pushObject(newEmptyColumn);
    }
  }
});
