import Ember from 'ember';
import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({

  buildURL(){
    return this._super(...arguments) + '/jobs/';
  },

  createJob(payload) {
    let postURL = this.buildURL();
    return this.ajax(postURL , 'POST', { data: {job: payload} });
  },
  getJob(jobId, dateSubmitted, firstCall){

    let url = '';
    if(firstCall){
      url = this.buildURL() + jobId + '/results?first=true&_='+ dateSubmitted;
    }else {
      url = this.buildURL() + jobId + '/results?_='+ dateSubmitted;
    }

    return this.ajax(url, 'GET')
  }

});
