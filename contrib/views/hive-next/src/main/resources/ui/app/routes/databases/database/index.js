import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    let selectedDatabase = this.modelFor('databases.database');
    this.transitionTo('databases.database.tables', selectedDatabase.get('name'));
  }
});
