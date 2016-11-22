import Ember from 'ember';
import tabs from '../../../../configs/table-level-tabs';

export default Ember.Route.extend({
  model(params) {
    let database = this.modelFor('databases.database').get('name');
    let table = params.name;
    return this.store.queryRecord('table', {databaseId: database, tableName: table});
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('tabs', tabs);
  },

  actions: {
  }
});
