import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller, model) {
    this._super(controller, model);
    let table = this.controllerFor('databases.database.tables.table').get('model');
    controller.set('table', table);
  },
});
