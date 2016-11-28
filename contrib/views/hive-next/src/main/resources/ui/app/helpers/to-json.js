import Ember from 'ember';

export function toJson([param, ...rest]/*, hash*/) {
  return JSON.stringify(param, null, '  ');
}

export default Ember.Helper.helper(toJson);
