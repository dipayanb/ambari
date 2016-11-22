import Ember from 'ember';

let tableLevelTabs = [
  Ember.Object.create({
    name: 'columns',
    label: 'COLUMNS',
    link: 'databases.database.tables.table.columns',
    faIcon: 'list'
  }),
  Ember.Object.create({
    name: 'ddl',
    label: 'DDL',
    link: 'databases.database.tables.table.ddl',
    faIcon: 'file-text-o'
  }),
  Ember.Object.create({
    name: 'statistics',
    label: 'STATISTICS',
    link: 'databases.database.tables.table.stats',
    faIcon: 'line-chart'
  })
];

export default tableLevelTabs;
