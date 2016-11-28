import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    let selectedDatabase = this.modelFor('databases.database');
    return this.store.query('table', {databaseId: selectedDatabase.get('name')});
  },

  afterModel(model) {
    if (model.get('length') > 0) {
      this.selectTable(model);
    }
  },
  selectTable(model) {
    let sortedModel = model.sortBy('name');
    let toSelect = sortedModel.get('firstObject');
    toSelect.set('selected', true);
  },
  actions: {
    tableSelected(table) {
      let tables = this.controllerFor('databases.database.tables').get('model');
      tables.forEach((table) => {
        table.set('selected', false);
      });
      table.set('selected', true);
      this.transitionTo('databases.database.tables.table', table.get('name'));
    }
  }
});
