import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  ping() {
    const url = this.urlForCreateRecord('ping');
    return this.ajax(url, 'POST');
  },

  pathForType() {
    return "system/ping";
  }
});
