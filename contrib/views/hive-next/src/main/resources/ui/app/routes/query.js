import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.store.findAll('database');
  },

  afterModel(model) {
    if (model.get('length') > 0) {
      this.selectDatabase(model);
    }
  },

  setupController(controller, model) {
    let sortedModel = model.sortBy('name');
    let selectedModel = sortedModel.filterBy('selected', true).get('firstObject');
    sortedModel.removeObject(selectedModel);
    let finalList = [];
    let selectedDB = [];

    finalList.pushObject(selectedModel);
    finalList.pushObjects(sortedModel);
    controller.set('model', finalList);

    selectedDB.pushObject(selectedModel);
    controller.set('selectedModel',selectedDB);


    let selecteDBName = selectedModel.get('name');
    let selectedTablesModel = this.store.query('table', {databaseId: selecteDBName});
    controller.set('selectedTablesModel',selectedTablesModel);

    controller.set('currentQuery', 'select 1;');


    controller.set('queryResults', 'Here you go.');



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

    xyz(selectedDBs){
      //console.log('xyz', selectedDBs);
      let selectedTablesModel = this.store.query('table', {databaseId: selectedDBs[selectedDBs.length -1]}); //How to club two models.
      this.get('controller').set('selectedTablesModel',selectedTablesModel);
    },

    tableSelected(){
      console.log('I am in tableSelected');
    },

    notEmptyDialogClosed() {
      this.get('controller').set('databaseNotEmpty', false);
      this.get('controller').set('databaseName', undefined);
    },

    executeQuery(){
      console.log(this.get('controller').get('currentQuery'))
    }
  }
});
