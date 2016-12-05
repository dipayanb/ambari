import Ember from 'ember';
import helpers from './helpers';

let hiveParameters = [
  Ember.Object.create({
    name: 'hive.tez.container.size',
    validate: helpers.regexes.digits
  }),
  Ember.Object.create({
    name: 'hive.prewarm.enabled',
    values: helpers.validationValues.bool
  }),
  Ember.Object.create({
    name: 'hive.prewarm.numcontainers',
    validate: helpers.regexes.digits
  }),
  Ember.Object.create({
    name: 'hive.tez.auto.reducer.parallelism',
    values: helpers.validationValues.bool
  }),
  Ember.Object.create({
    name: 'hive.execution.engine',
    values: helpers.validationValues.execEngine
  }),
  Ember.Object.create({
    name: 'hive.vectorized.execution.enabled',
    values: helpers.validationValues.bool
  }),
  Ember.Object.create({
    name: 'hive.auto.convert.join',
    values: helpers.validationValues.bool
  }),
  Ember.Object.create({
    name: 'tez.am.resource.memory.mb',
    validate: helpers.regexes.digits
  }),
  Ember.Object.create({
    name: 'tez.am.container.idle.release-timeout-min.millis',
    validate: helpers.regexes.digits
  }),
  Ember.Object.create({
    name: 'tez.am.container.idle.release-timeout-max.millis',
    validate: helpers.regexes.digits
  }),
  Ember.Object.create({
    name: 'tez.queue.name',
    validate: helpers.regexes.name
  }),
  Ember.Object.create({
    name: 'tez.runtime.io.sort.mb',
    validate: helpers.regexes.digits
  }),
  Ember.Object.create({
    name: 'tez.runtime.sort.threads',
    validate: helpers.regexes.digits
  }),
  Ember.Object.create({
    name: 'tez.runtime.compress.codec',
    validate: helpers.regexes.dotPath
  }),
  Ember.Object.create({
    name: 'tez.grouping.min-size',
    validate: helpers.regexes.digits
  }),
  Ember.Object.create({
    name: 'tez.grouping.max-size',
    validate: helpers.regexes.digits
  }),
  Ember.Object.create({
    name: 'tez.generate.debug.artifacts',
    values: helpers.validationValues.bool
  })
];

export default hiveParameters;
