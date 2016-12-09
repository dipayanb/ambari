import Ember from 'ember';
import datatypes from '../configs/datatypes';

export default Ember.Component.extend({
  tagName: 'tr',

  advancedOption: false,
  datatypes: Ember.copy(datatypes),
  errors: [],

  validateInput() {
    if (Ember.isEmpty(this.get('name'))) {
      this.get('errors').pushObject({type: 'name', error: "name cannot be empty"});
    }
    return true;
  },
  didReceiveAttrs() {
    let selected = this.get('datatypes').findBy('label', this.get('column.label'));
    if (Ember.isEmpty(selected)) {
      this.set('selectedType', this.get('datatypes.firstObject'))
    } else {
      this.set('selectedType', selected);
    }
  },

  actions: {
    typeSelectionMade(datatype) {
      this.set('selectedType', datatype);
      this.set('hasPrecision', datatype.hasPrecision);
      this.set('hasScale', datatype.hasScale);
    },

    advanceOptionToggle() {
      this.toggleProperty('advancedOption');
    },

    add(){
      let validationResult = this.validateInput();
      console.log("Adding column");
    },

    cancel() {
      console.log("Cancelling column");
    }
  }
});
