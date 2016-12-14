import Ember from 'ember';

export default Ember.Object.extend({
  key: '',
  value: '',


  hasError: Ember.computed('errors', function() { return this.get('errors.length') !== 0; }),
  errors: [],

  keyError: Ember.computed('errors.@each', function() {
    return this.get('errors').findBy('type', 'key');
  }),

  valueError: Ember.computed('errors.@each', function() {
    return this.get('errors').findBy('type', 'value');
  }),


  // Control the UI
  editing: false,


  validate() {
    this.set('errors', []);
    if (Ember.isEmpty(this.get('key'))) {
      this.get('errors').pushObject({type: 'key', error: "Name cannot be empty"});
    }

    if(Ember.isEmpty(this.get('value'))) {
      this.get('errors').pushObject({type: 'value', error: "Value cannot be empty"});
    }

    return this.get('errors.length') === 0;
  }
})
