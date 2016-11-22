import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    let selectedDatabase = this.modelFor('databases.database');
    return this.store.query('table', {databaseId: selectedDatabase.get('name')});
  }
});
