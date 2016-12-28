import Ember from 'ember';
import Helper from '../configs/helpers';

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    this.set('columns', Ember.A());
    this.set('properties', []);
    this.set('settings', {});
    this.set('shouldAddBuckets', null);
    this.set('settingErrors', []);
  },

  didReceiveAttrs() {
    this.get('tabs').setEach('active', false);
    let firstTab = this.get('tabs.firstObject')
    firstTab.set('active', true);
  },

  actions: {
    activate(link) {
      console.log("Activate: ", link);
    },

    create() {
      if (this.validate()) {
        this.sendAction('create', {
          name: this.get('tableName'),
          columns: this.get('columns'),
          settings: this.get('settings'),
          properties: this.get('properties')
        });
      }
    },

    cancel() {
      this.sendAction('cancel');
    }
  },

  validate() {
    if (!this.validateTableName()) {
      return false;
    }
    if (!(this.checkColumnsExists() &&
      this.checkColumnUniqueness() &&
      this.validateColumns())) {
      this.selectTab("create.table.columns");
      return false;
    }

    if(!(this.validateNumBuckets())) {
      this.selectTab("create.table.advanced");
      return false;
    }

    if (!(this.validateTableProperties())) {
      this.selectTab("create.table.properties");
      return false;
    }
    return true;
  },
  validateTableName() {
    this.set('hasTableNameError');
    this.set('tableNameErrorText');

    if (Ember.isEmpty(this.get('tableName'))) {
      this.set('hasTableNameError', true);
      this.set('tableNameErrorText', 'Name cannot be empty');
      return false;
    }

    return true;
  },

  checkColumnsExists() {
    this.set('hasEmptyColumnsError');
    this.set('emptyColumnsErrorText');
    if (this.get('columns.length') === 0) {
      this.set('hasEmptyColumnsError', true);
      this.set('emptyColumnsErrorText', 'No columns configured. Add some column definitions.');
      return false;
    }
    return true;
  },

  checkColumnUniqueness() {
    let columnNames = [];
    for (let i = 0; i < this.get('columns.length'); i++) {
      let column = this.get('columns').objectAt(i);
      column.clearError();
      if (columnNames.indexOf(column.get('name')) === -1) {
        columnNames.pushObject(column.get('name'));
      } else {
        column.get('errors').push({type: 'name', error: 'Name should be unique'});
        return false;
      }
    }

    return true;
  },

  validateColumns() {
    for (let i = 0; i < this.get('columns.length'); i++) {
      let column = this.get('columns').objectAt(i);
      if (!column.validate()) {
        return false;
      }
    }
    return true;
  },

  validateTableProperties() {
    for (let i = 0; i < this.get('properties.length'); i++) {
      let property = this.get('properties').objectAt(i);
      if (!property.validate()) {
        return false;
      }
    }
    return true;
  },

  validateNumBuckets() {
    let clusteredColumns = this.get('columns').filterBy('isClustered', true);
    if(clusteredColumns.get('length') > 0 &&
      (Ember.isEmpty(this.get('settings.numBuckets')) ||
      !Helper.isInteger(this.get('settings.numBuckets')))) {
      this.get('settingErrors').pushObject({type: 'numBuckets', error: "Some columns are clustered, Number of buckets are required."});
      return false;
    }

    return true;
  },

  selectTab(link) {
    this.get('tabs').setEach('active', false);
    let selectedTab = this.get('tabs').findBy('link', link);
    if (!Ember.isEmpty(selectedTab)) {
      selectedTab.set('active', true);
    }
  }
});
