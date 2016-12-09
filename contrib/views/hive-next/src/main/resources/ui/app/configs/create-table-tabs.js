import Ember from 'ember';

let createTableTabs = [
  Ember.Object.create({
    name: 'columns',
    label: 'COLUMNS',
    transition: false,
    link: 'create.table.columns',
    faIcon: 'list'
  }),

  Ember.Object.create({
    name: 'advanced',
    label: 'ADVANCED',
    transition: false,
    link: 'create.table.advanced',
    faIcon: 'file-text-o'
  }),

  Ember.Object.create({
    name: 'properties',
    label: 'TABLE PROPERTIES',
    transition: false,
    link: 'create.table.properties',
    faIcon: 'file-text-o'
  })

];

export default createTableTabs;
