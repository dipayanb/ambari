import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    let selectedTable = this.modelFor('databases.database.tables').filterBy('selected', true).get('firstObject');
    this.transitionTo('databases.database.tables.table', selectedTable);
  }
});
