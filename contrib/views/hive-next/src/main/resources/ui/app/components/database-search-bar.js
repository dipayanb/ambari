import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['database-search', 'clearfix'],
  databases: [],

  heading: 'database',
  subHeading: 'Select or search database/schema',
  enableSecondaryAction: true,
  secondaryActionText: 'Browse',
  secondaryActionFaIcon: 'folder',

  extendDrawer: false,
  filterText: '',

  selectedDatabase: Ember.computed('databases.@each.selected', function() {
    return this.get('databases').findBy('selected', true);
  }),

  filteredDatabases: Ember.computed('filterText', 'databases.@each', function() {
    return this.get('databases').filter((item) => {
      return item.get('name').indexOf(this.get('filterText')) !== -1;
    });
  }),

  resetDatabaseSelection() {
    this.get('databases').forEach(x => {
        if (x.get('selected')) {
          x.set('selected', false);
        }
    });
  },

  didRender() {
    this._super(...arguments);
    this.$('input.display').on('focusin', () => {
      this.set('extendDrawer', true);
      Ember.run.later(() => {
        this.$('input.search').focus();
      });
    });
  },

  actions: {
    secondaryActionClicked: function() {
      this.toggleProperty('extendDrawer');
      Ember.run.later(() => {
        this.$('input.search').focus();
      });
    },

    databaseClicked: function(database) {
      this.resetDatabaseSelection();
      database.set('selected', true);
      this.set('extendDrawer', false);
      this.set('filterText', '');
      this.sendAction('selected', database);
    }
  }
});
