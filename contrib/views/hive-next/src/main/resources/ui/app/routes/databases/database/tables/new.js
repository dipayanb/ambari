import Ember from 'ember';
import tabs from '../../../../configs/create-table-tabs';

export default Ember.Route.extend({
  model() {
    console.log('coming here in new table!!!!');
  },

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
      console.log("Coming here to create!!!", settings);
    }
  }
});
