import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['list-filter'],
  header: '',
  subHeader: '',
  items: [],
  filterText: '',
  emptyFilterText: Ember.computed('filterText', function() {
    return this.get('filterText').length === 0;
  }),
  filteredItems: Ember.computed('filterText', 'items.@each', function() {
    return this.get('items').filter((item) => {
      return item.get('name').indexOf(this.get('filterText')) !== -1;
    });
  }),

  actions: {
    enableFilter() {
      this.$('input').focus();
    },

    disableFilter() {
      this.set('filterText', '');
    }
  }
});
