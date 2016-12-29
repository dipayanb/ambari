import Ember from 'ember';

export default Ember.Component.extend({
  startTime: null,
  endTime: null,
  maxEndTime: null,
  statusCounts: Ember.computed('jobs', function() {
    return this.get('jobs').reduce((acc, item, index) => {
      let status = item.get('status').toLowerCase();
      if(Ember.isEmpty(acc[status])) {
        acc[status] = 1;
      } else {
        acc[status] = acc[status] + 1;
      }

      return acc;
    }, {});
  }),


  actions: {
    setDateRange(startDate, endDate) {
      this.sendAction('filterChanged', startDate, endDate);
    },

    expandJob(jobId) {
      console.log("Job to be expanded", jobId);
    }
  }
});
