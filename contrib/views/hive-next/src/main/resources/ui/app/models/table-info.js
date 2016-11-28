import DS from 'ember-data';

export default DS.Model.extend({
  database: DS.attr('string'),
  table: DS.attr('string'),
  columns: DS.attr(),
  ddl: DS.attr('string'),
  partitionInfo: DS.attr(),
  detailedInfo: DS.attr(),
  storageInfo: DS.attr(),
  viewInfo: DS.attr()
});
