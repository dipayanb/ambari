import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  fetchResult(jobId) {
    let resultUrl = this.urlForFindRecord(jobId, 'job') + "/results";
    return this.ajax(resultUrl, 'GET');
  },

  getQuery(job) {
    let queryUrl = this.buildURL() + "/file" + encodeURI(job.get('queryFile'));
    console.log(queryUrl);
  }
});
