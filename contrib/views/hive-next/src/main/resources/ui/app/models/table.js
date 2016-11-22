import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  type: DS.attr('string'),
  columns: DS.attr(),
  database: DS.belongsTo('database'),
  selected: false,
  icon: Ember.computed('type', function() {
    if(this.get('type').toLowerCase() === 'view') {
      return "eye";
    } else {
      return "table";
    }
  })
});
