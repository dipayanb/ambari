import Ember from 'ember';
import datatypes from '../configs/datatypes';

export default Ember.Component.extend({
  tagName: 'tr',
  advancedOption: false,
  datatypes: Ember.copy(datatypes),



  hasPrecision: Ember.computed.oneWay('column.type.hasPrecision'),
  hasScale: Ember.computed.oneWay('column.type.hasScale'),

  columnMetaType: null,


  didInsertElement() {
    Ember.run.later( () => {
      this.$('input').focus();
    });
  },
  didReceiveAttrs() {
    if(this.get('column.isPartitioned')) {
      this.set('columnMetaType', 'partitioned');
    } else if(this.get('column.isPartitioned')) {
      this.set('columnMetaType', 'clustered');
    } else {
      this.set('columnMetaType');
    }
  },

  actions: {
    typeSelectionMade(datatype) {
      this.set('column.type', datatype);
    },

    advanceOptionToggle() {
      this.toggleProperty('advancedOption');
    },

    edit() {
      this.set('column.editing', true);
      Ember.run.later(() => {
        this.$('input').focus();
      });
    },

    delete() {
      console.log('deleting column');
      this.sendAction('columnDeleted', this.get('column'));
    }
  }
});
