import Ember from 'ember';
import DS from 'ember-data';
import ENV from 'ui/config/environment';

export default DS.RESTAdapter.extend({
  init: function() {
    Ember.$.ajaxSetup({
      cache: false
    });
  },

  namespace: Ember.computed(function() {
    var parts = window.location.pathname.split('/').filter(function(i) {
      return i !== "";
    });
    var view = parts[parts.length - 3];
    var version = '/versions/' + parts[parts.length - 2];
    var instance = parts[parts.length - 1];

    if (!/^(\d+\.){2,3}\d+$/.test(parts[parts.length - 2])) { // version is not present
      instance = parts[parts.length - 2];
      version = '';
    }
    if(ENV.environment === 'development') {
      return 'resources';
    }
    return 'api/v1/views/' + view + version + '/instances/' + instance + '/resources';
  }),

  headers: Ember.computed(function() {
    let headers = {
      'X-Requested-By': 'ambari',
      'Content-Type': 'application/json'
    };

    if(ENV.environment === 'development') {
      // In development mode when the UI is served using ember serve the xhr requests are proxied to ambari server
      // by setting the proxyurl parameter in ember serve and for ambari to authenticate the requests, it needs this
      // basic authorization. This is for default admin/admin username/password combination.
      headers['Authorization'] = 'Basic YWRtaW46YWRtaW4=';
    }
     return headers;
  }),
});
