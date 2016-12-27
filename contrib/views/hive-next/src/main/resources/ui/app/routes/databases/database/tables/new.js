import Ember from 'ember';
import tabs from '../../../../configs/create-table-tabs';

export default Ember.Route.extend({
  createTable: Ember.inject.service(),

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('tabs', Ember.copy(tabs));
  },

  actions: {
    cancel() {
      let databaseController = this.controllerFor('databases.database');
      this.transitionTo('databases.database', databaseController.get('model'));
    },

    create(settings) {
      this.controller.set('showCreateTableModal', true);
      this.controller.set('createTableMessage', 'Submitting request to create table');
      let databaseModel = this.controllerFor('databases.database').get('model');
      this.get('createTable').submitCreateTable(databaseModel.get('name'), settings)
        .then((job) => {
          console.log('Created job: ', job.get('id'));
          this.controller.set('createTableMessage', 'Waiting for the table to be created');
          this.get('createTable').waitForJobToComplete(job.get('id'), 5 * 1000)
            .then((status) => {
              this.controller.set('createTableMessage', "Successfully created table");
              Ember.run.later(() => {
                this.controller.set('showCreateTableModal', false);
                this.controller.set('createTableMessage');
                this._transitionToCreatedTable(databaseModel.get('name'), settings.name);
              }, 2 * 1000);
            }, (error) => {
              // TODO: handle error
              Ember.run.later(() => {
                this.controller.set('showCreateTableModal', false);
                this.controller.set('createTableMessage');
                this.transitionTo('databases.database', databaseModel.get('name'));
              }, 2 * 1000);
            });
        }, (error) => {
          console.log("Error encountered", error);
          this.controller.set('showCreateTableModal', true);
        });
    }
  },

  _transitionToCreatedTable(database, table) {
    this.transitionTo('databases.database.tables.table', database, table);
  }
});
