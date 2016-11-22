import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.store.findAll('database');
  },

  afterModel(model) {
    if(model.get('length') > 0) {
      this.selectDatabase(model);
    }
  },

  setupController(controller, model) {
    let sortedModel =  model.sortBy('name');
    let selectedModel = sortedModel.filterBy('selected', true).get('firstObject');
    sortedModel.removeObject(selectedModel);
    let finalList = [];
    finalList.pushObject(selectedModel);
    finalList.pushObjects(sortedModel);
    controller.set('model', finalList);
  },

  selectDatabase(model) {
    // check if default database is present
    let toSelect = model.findBy('name', 'default');
    if (Ember.isEmpty(toSelect)) {
      let sortedModel = model.sortBy('name');
      toSelect = sortedModel.get('firstObject');
    }
    toSelect.set('selected', true);
  },

  actions: {
    databaseSelected(database) {
      this.transitionTo('databases.database.tables', database.get('id'));
    }
  }
});
