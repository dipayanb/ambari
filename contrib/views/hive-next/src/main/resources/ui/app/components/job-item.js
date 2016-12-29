import Ember from 'ember';

export default Ember.Component.extend({
  jobs: Ember.inject.service(),
  tagName: '',
  expanded: false,
  expandedValue: null,
  actions: {
    toggleExpandJob(jobId) {
      this.toggleProperty('expanded');
      this.set('valueLoading', true);
      this.get('jobs').getQuery(jobId).then((queryFile) => {
        this.set('queryFile', queryFile);
        this.set('valueLoading', false);
      }).catch((err) => {
        this.set('valueLoading', false);
      })
    }
  }
});
