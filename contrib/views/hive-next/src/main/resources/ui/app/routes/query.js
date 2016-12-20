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

    let self = this;
    let selectedTablesModels =[];

    selectedTablesModels.pushObject(
      {
        'dbname': selecteDBName ,
        'tables': this.store.query('table', {databaseId: selecteDBName})
      }
    )


    controller.set('selectedTablesModels',selectedTablesModels );
    controller.set('currentQuery', 'select 1;');
    controller.set('queryResults', 'Query Result Placeholder');

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

      let self = this;
      let selectedTablesModels =[];

      selectedDBs.forEach(function(db){
        selectedTablesModels.pushObject(
          {
           'dbname': db ,
           'tables':self.store.query('table', {databaseId: db})
          }
        )
      });

      this.get('controller').set('selectedTablesModels', selectedTablesModels );

    },

    tableSelected(){
      console.log('I am in tableSelected');
    },

    showTables(db){
      //should we do this by writing a seperate component.
      $('.collapse').hide();
      $('#' + db).toggle();
    },

    notEmptyDialogClosed() {
      this.get('controller').set('databaseNotEmpty', false);
      this.get('controller').set('databaseName', undefined);
    },

    executeQuery(){
      console.log(this.get('controller').get('currentQuery'))
      this.get('controller').set('queryResults', 'Query result for --> ' + this.get('controller').get('currentQuery'));
    }
  }
});
