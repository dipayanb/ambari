import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  tables: DS.hasMany('table'),
  selected: DS.attr('boolean', {transient: true, defaultValue: false})
});
