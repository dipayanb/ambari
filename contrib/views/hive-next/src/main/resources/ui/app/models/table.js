import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  type: DS.attr('string'),
  columns: DS.attr(),
  database: DS.belongsTo('database'),
  selected: false
});
