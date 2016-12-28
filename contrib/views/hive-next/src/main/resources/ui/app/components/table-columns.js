import Ember from 'ember';
import Column from '../models/column';

export default Ember.Component.extend({
  columns: [],
  shouldAddBuckets: null,

  clusteredColumnObserver: Ember.observer('columns.@each.isClustered', function(sender, key, value, rev) {
    let clusteredColumns = this.get('columns').filterBy('isClustered');
    if (clusteredColumns.length > 0) {
      this.set('shouldAddBuckets', true);
    } else {
      if(!Ember.isEmpty(this.get('shouldAddBuckets'))) {
        this.set('shouldAddBuckets', false);
      }

    }
  }),

  actions: {
    addNewColumn() {
      let newEmptyColumn = Column.create({editing: true});
      this.get('columns').pushObject(newEmptyColumn);
    },

    columnDeleted(column) {
      this.get('columns').removeObject(column);
    },

    columnUpdated() {

    }
  }
});
