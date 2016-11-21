import Ember from 'ember';
import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  namespace: Ember.computed(function() {
    return this._super(...arguments) + '/ddl';
  })
});
