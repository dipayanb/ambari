import Ember from 'ember';

export default Ember.Route.extend({
  moment: Ember.inject.service(),
  timeInitializedTo: null,
  queryParams: {
    startTime: {
      refreshModel: true
    },
    endTime: {
      refreshModel: true
    }
  },


  model(params) {
    let now = this.get('moment').moment();
    if(Ember.isEmpty(params.startTime) || Ember.isEmpty(params.endTime)) {
      let initialValue = now.clone();
      params.endTime = now.valueOf();
      params.startTime = now.subtract('7', 'days').valueOf();
      this.set('timeInitializedTo', initialValue);
    }

    return this.store.query('job', params);
  },

  setupController(controller, model) {
    if(!Ember.isEmpty(this.get('timeInitializedTo'))) {

      controller.set('endTime', this.get('timeInitializedTo').valueOf());
      controller.set('startTime', this.get('timeInitializedTo').subtract('7', 'days').valueOf());
      //unset timeInitializedTo
      this.set('timeInitializedTo');
    }

    this._super(...arguments);

  },

  actions: {
    dateFilterChanged(startTime, endTime) {
      this.controller.set('startTime', this.get('moment').moment(startTime, 'YYYY-MM-DD').valueOf())
      this.controller.set('endTime', this.get('moment').moment(endTime, 'YYYY-MM-DD').valueOf())
      this.refresh();
    }
  }



});
