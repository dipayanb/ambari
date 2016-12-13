import Ember from 'ember';
import datatypes from '../configs/datatypes';
import Helper from '../configs/helpers';

export default Ember.Object.extend({
  name: '',
  type: datatypes[0],
  precision: 0,
  scale: 0,
  isPartitionColumn: false,
  comment: '',


  hasError: Ember.computed('errors', function() { return this.get('errors.length') !== 0; }),
  errors: [],

  nameError: Ember.computed('errors.@each', function() {
    return this.get('errors').findBy('type', 'name');
  }),

  typeError: Ember.computed('errors.@each', function() {
    return this.get('errors').findBy('type', 'type');
  }),


  precisionError: Ember.computed('errors.@each', function() {
    return this.get('errors').findBy('type', 'precision');
  }),

  scaleError: Ember.computed('errors.@each', function() {
    return this.get('errors').findBy('type', 'scale');
  }),


  // Control the UI
  editing: false,


  validate() {
    this.set('errors', []);
    if (Ember.isEmpty(this.get('name'))) {
      this.get('errors').pushObject({type: 'name', error: "name cannot be empty"});
    }

    if(Ember.isEmpty(this.get('type'))) {
      this.get('errors').pushObject({type: 'type', error: "Type cannot be empty"});
    }

    if(this.get('type.hasPrecision')) {
      if(Ember.isEmpty(this.get('precision'))) {
        this.get('errors').pushObject({type: 'precision', error: "Precision cannot be empty"});
      } else if(!Helper.isInteger(this.get('precision'))) {
        this.get('errors').pushObject({type: 'precision', error: "Precision can only be a number"});
      } else if(this.get('precision') <= 0) {
        this.get('errors').pushObject({type: 'precision', error: "Precision can only be greater than zero"});
      }

    }

    if(this.get('type.hasScale')) {
      if(Ember.isEmpty(this.get('scale'))) {
        this.get('errors').pushObject({type: 'scale', error: "Scale cannot be empty"});
      } else if(!Helper.isInteger(this.get('scale'))) {
        this.get('errors').pushObject({type: 'scale', error: "Scale can only be a number"});
      } else if(this.get('scale') <= 0) {
        this.get('errors').pushObject({type: 'scale', error: "Scale can only be greater than zero"});
      }

    }
    return this.get('errors.length') === 0;
  }
})
