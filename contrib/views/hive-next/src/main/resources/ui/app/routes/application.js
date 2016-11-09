import Ember from 'ember';
import tabs from '../configs/top-level-tabs'

export default Ember.Route.extend({
  keepAlive: Ember.inject.service('keep-alive'),
  init: function() {
    this._super(...arguments);
    this.get('keepAlive').initialize();
  },
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('tabs', tabs);
  }
});
