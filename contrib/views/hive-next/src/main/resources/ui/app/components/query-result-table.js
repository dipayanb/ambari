import Ember from 'ember';
import Table from 'ember-light-table';
import TableCommon from '../mixins/table-common';

export default Ember.Component.extend({

  classNames: ['query-result-table', 'clearfix'],

  queryResult: {'schema' :[], 'rows' :[]},

  columns: Ember.computed('queryResult', function() {
    let queryResult = this.get('queryResult');
    let columnArr =[];

    this.get('queryResult').schema.forEach(function(column){
      let tempColumn = {};

      tempColumn['label'] = column[0];

      let localValuePath = column[0];
      tempColumn['valuePath'] = localValuePath.substring(localValuePath.lastIndexOf('.') +1 , localValuePath.length);

      columnArr.push(tempColumn);
    });
    return columnArr;
  }),

  rows: Ember.computed('queryResult','columns', function() {
    let rowArr = [], self = this;

    if(self.get('columns').length > 0) {
      self.get('queryResult').rows.forEach(function(row, rowindex){
        var mylocalObject = {};
        self.get('columns').forEach(function(column, index){
          mylocalObject[self.get('columns')[index].valuePath] = row[index];
        })
        rowArr.push(mylocalObject);
      });
      return rowArr;
    }
    return rowArr;
  }),

  table: Ember.computed('queryResult', 'rows', 'columns', function() {
    return new Table(this.get('columns'), this.get('rows'));
  }),

  actions: {
    onScrolledToBottom() {
      //this.send('goNextPage');
      console.log('hook for INFINITE scroll');
    },

    onColumnClick(column) {
      console.log('I am in onColumnClick');
    },
    goNextPage(){
      this.sendAction('goNextPage');
    },
    goPrevPage(){
      this.sendAction('goPrevPage');
    }

  }

});
