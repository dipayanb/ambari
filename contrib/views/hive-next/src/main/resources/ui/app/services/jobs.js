import Ember from 'ember';

export default Ember.Service.extend({
  store: Ember.inject.service(),
  getQuery(jobId) {
    return this.get('store').findRecord('job', jobId).then((job) => {
      return this.get('store').findRecord('file', job.get('queryFile'));
    })
  }
});
