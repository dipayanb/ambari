import Ember from 'ember';
import Table from 'ember-light-table';
import TableCommon from '../mixins/table-common';

export default Ember.Component.extend({

  classNames: ['query-result-table', 'clearfix'],
  model: [{firstName: 'Ram'},{firstName: 'Shyam'},{firstName: 'Mohan'},{firstName: 'Ram'},{firstName: 'Shyam'},{firstName: 'Mohan'},{firstName: 'Ram'},{firstName: 'Shyam'},{firstName: 'Mohan'},{firstName: 'Ram'},{firstName: 'Shyam'},{firstName: 'Mohan'},{firstName: 'Ram'},{firstName: 'Shyam'},{firstName: 'Mohan'},{firstName: 'Ram'},{firstName: 'Shyam'},{firstName: 'Mohan'},{firstName: 'Ram'},{firstName: 'Shyam'},{firstName: 'Mohan'},{firstName: 'Ram'},{firstName: 'Shyam'},{firstName: 'Mohan'},{firstName: 'Ram'},{firstName: 'Shyam'},{firstName: 'Mohan'},{firstName: 'Ram'},{firstName: 'Shyam'},{firstName: 'Mohan'},{firstName: 'Ram'},{firstName: 'Shyam'},{firstName: 'Mohan'},{firstName: 'Ram'},{firstName: 'Shyam'},{firstName: 'Mohan'},{firstName: 'Ram'},{firstName: 'Shyam'},{firstName: 'Mohan'},{firstName: 'Ram'},{firstName: 'Shyam'},{firstName: 'Mohan'},{firstName: 'Ram'},{firstName: 'Shyam'},{firstName: 'Mohan'},{firstName: 'Ram'},{firstName: 'Shyam'},{firstName: 'Mohan'},{firstName: 'Ram'},{firstName: 'Shyam'},{firstName: 'Mohan'},{firstName: 'Ram'},{firstName: 'Shyam'},{firstName: 'Mohan'},{firstName: 'Ram'},{firstName: 'Shyam'},{firstName: 'Mohan'},{firstName: 'Ram'},{firstName: 'Shyam'},{firstName: 'Mohan'},{firstName: 'Ram'},{firstName: 'Shyam'},{firstName: 'Mohan'},{firstName: 'Ram'},{firstName: 'Shyam'},{firstName: 'Mohan'},{firstName: 'Ram'},{firstName: 'Shyam'},{firstName: 'Mohan'},{firstName: 'Ram'},{firstName: 'Shyam'},{firstName: 'Mohan'},{firstName: 'Ram'},{firstName: 'Shyam'},{firstName: 'Mohan'}],

  columns: Ember.computed(function() {
    return [
      {
      label: 'First Name',
      valuePath: 'firstName',
      }
    ];

    /*
    return [{
      label: 'Avatar',
      valuePath: 'avatar',

      sortable: false,
      cellComponent: 'user-avatar'
    }, {
      label: 'First Name',
      valuePath: 'firstName',
    }, {
      label: 'Last Name',
      valuePath: 'lastName',
    }];
    */

  }),

  table: Ember.computed('model', function() {
    return new Table(this.get('columns'), this.get('model'));
  }),

  actions: {
    onScrolledToBottom() {
      console.log('I am in onScrolledToBottom');
    },

    onColumnClick(column) {
      console.log('I am in onColumnClick');
    }
  }

});
