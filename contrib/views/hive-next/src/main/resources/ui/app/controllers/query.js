import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {
    updateMyCode(updatedQuery) {
      this.set('currentQuery', updatedQuery);
    }
  }

});
