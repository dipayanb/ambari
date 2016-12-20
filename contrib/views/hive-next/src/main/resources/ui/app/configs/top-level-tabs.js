import Ember from 'ember';

let topLevelTabs = [
  Ember.Object.create({
    name: 'query',
    label: 'QUERY',
    link: 'query',
    faIcon: 'paper-plane'
  }),
  Ember.Object.create({
    name: 'jobs',
    label: 'JOBS',
    link: 'jobs',
    faIcon: 'paper-plane'
  }),
  Ember.Object.create({
    name: 'tables',
    label: 'TABLES',
    link: 'databases',
    faIcon: 'table'
  }),
  Ember.Object.create({
    name: 'saves-queries',
    label: 'SAVED QUERIES',
    link: 'savedqueries',
    faIcon: 'paperclip'
  }),
  Ember.Object.create({
    name: 'udfs',
    label: 'UDFs',
    link: 'udfs',
    faIcon: 'puzzle-piece'
  }),
  Ember.Object.create({
    name: 'settings',
    label: 'SETTINGS',
    link: 'settings',
    faIcon: 'cog'
  }),
  Ember.Object.create({
    name: 'notifications',
    label: 'NOTIFICATIONS',
    link: 'notifications',
    faIcon: 'bell',
    pullRight: true
  })
];

export default topLevelTabs;
