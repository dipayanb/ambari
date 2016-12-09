import Ember from 'ember'

export default Ember.Object.extend({
  name: '',
  dataType: '',
  precision: 0,
  scale: 0,
  isPartitionColumn: false,
  comment: '',


  // Control the UI
  editing: false
})
