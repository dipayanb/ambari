import Ember from 'ember';

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    this.set('columns', []);
    this.set('properties', []);
    this.set('settings', {});
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
        this.sendAction('create', this.get('settings'));
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

  selectTab(link) {
    this.get('tabs').setEach('active', false);
    let selectedTab = this.get('tabs').findBy('link', link);
    if (!Ember.isEmpty(selectedTab)) {
      selectedTab.set('active', true);
    }
  }
});
