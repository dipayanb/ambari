import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['database-search', 'clearfix'],

  heading: 'database',
  subHeading: 'Select or search namespace',
  enableSecondaryAction: true,
  secondaryActionText: 'Browse',
  secondaryActionFaIcon: 'folder',

  actions: {
    secondaryActionClicked: function() {
      console.log("Action clicked");
    }
  }
});
