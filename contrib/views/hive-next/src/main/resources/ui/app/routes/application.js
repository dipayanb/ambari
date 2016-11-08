import Ember from 'ember';
import tabs from '../configs/top-level-tabs'

export default Ember.Route.extend({
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('tabs', tabs);
  }
});
