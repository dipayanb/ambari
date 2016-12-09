import Ember from 'ember';

export default Ember.Component.extend({

  didReceiveAttrs() {
    let firstTab = this.get('tabs.firstObject')
    firstTab.set('active', true);
  },

  actions: {
    activate(link) {
      console.log("Activate: ", link);
    }
  }
});
