import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['multiple-database-search', 'clearfix'],

  databases: [],

  //will make use of these in templates
  heading: 'database',
  subHeading: 'Select or search database/schema',

  selectedDatabase: Ember.computed('databases.@each.selected', function() {
    return this.get('databases').findBy('selected', true);
  }),

  filteredDatabases: Ember.computed('filterText', 'databases.@each', function() {
    return this.get('databases').filter((item) => {
      return item.get('name');
    });
  }),

  resetDatabaseSelection() {
    this.get('databases').forEach(x => {
      if (x.get('selected')) {
        x.set('selected', false);
      }
    });
  },

  allDbs: Ember.computed('selectedDatabase','filteredDatabases', function() {
    let dblist =[];
    this.get('filteredDatabases').forEach(db => {
      dblist.push(db.get('name'));
    });

    return dblist;
  }),

  selectedDbs: Ember.computed('selectedDatabase','filteredDatabases', function() {
    let selecteddblist =[];
    selecteddblist.push(this.get('selectedDatabase.name')); //As of now for single selection but will convert this for multiple DBs selected.
    return selecteddblist;
  }),

  actions: {
    createOnEnter(select, e) {
      if (e.keyCode === 13 && select.isOpen &&
        !select.highlighted && !Ember.isBlank(select.searchText)) {

        let selected = this.get('selectedDbs');
        if (!selected.includes(select.searchText)) {
          this.get('options').pushObject(select.searchText);
          select.actions.choose(select.searchText);
        }
      }
    },

    updateTables(){
      console.log('updateTables for selected databases.', this.get('selectedDbs'));
      this.sendAction('xyz', this.get('selectedDbs'));
    }

  }

});
