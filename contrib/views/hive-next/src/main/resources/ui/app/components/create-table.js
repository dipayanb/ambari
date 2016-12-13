import Ember from 'ember';

export default Ember.Component.extend({
  columns: [],
  columnsCount: Ember.computed.alias('columns.length'),

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
