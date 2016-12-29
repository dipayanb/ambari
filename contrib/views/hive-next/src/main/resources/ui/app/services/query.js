import Ember from 'ember';

export default Ember.Service.extend({

  store: Ember.inject.service(),

  createJob(payload){
    return new Promise( (resolve, reject) => {
      this.get('store').adapterFor('query').createJob(payload).then(function(data) {
        resolve(data);
      }, function(err) {
        reject(err);
      });
    });
  },
  getJob(jobId, dateSubmitted, firstCall){
    let self = this;
    return new Promise( (resolve, reject) => {
      this.get('store').adapterFor('query').getJob(jobId, dateSubmitted, firstCall).then(function(data) {
        resolve(data);
      }, function(err) {
          reject(err);
      });
    });
  }

});
