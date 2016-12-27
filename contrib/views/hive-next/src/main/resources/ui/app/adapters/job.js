import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  fetchResult(jobId) {
    let resultUrl = this.urlForFindRecord(jobId, 'job') + "/results";
    return this.ajax(resultUrl, 'GET');
  }
});
