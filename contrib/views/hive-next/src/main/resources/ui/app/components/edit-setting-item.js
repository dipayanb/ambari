import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  hiveParameterNames: Ember.computed('hiveParameters', function() {
    return this.get('hiveParameters').mapBy('name');
  }),
  setUserSettingsAddOption: function (list, term) {
    let filteredList = list.filter(x => x.get('name').toLowerCase().indexOf('Add') !== -1);
    if(filteredList.get('length') > 0) {
      let addOption = filteredList.objectAt(0);
      list.removeObject(addOption);
    }

    list.unshiftObject(Ember.Object.create({name: `Add '${term}' to list`, actualValue: term}));
    return list;
  },
  actions: {
    searchAction(term) {
      this.set('currentSearchField', term);
      // Check for partial Matches
      let filteredList = this.get('hiveParameters').filter(x => x.get('name').toLowerCase().indexOf(term.toLowerCase()) !== -1);
      //check for exact matches
      let exactMatch = filteredList.filterBy('name', term);
      if(exactMatch.get('length') === 0) {
        filteredList = this.setUserSettingsAddOption(filteredList, term);
      }
      return filteredList;
    },
    selectionMade(selection, list) {
      this.get('hiveParameters').setEach('disable', false);
      if(selection.get('name').startsWith('Add')) {
        let actualValue = selection.get('actualValue');
        let newParam = Ember.Object.create({name: actualValue, disabled: true});
        this.set('selectedParam', newParam);
        this.get('hiveParameters').unshiftObject(newParam);
      } else {
        selection.set('disabled', true);
        this.set('selectedParam', selection);
      }
    },
    cancel() {
      this.sendAction('cancelAction', this.get('setting'));
    },
    update() {
      let selected = this.get('selectedParam');
      this.set('setting.key', selected.get('name'));
      this.set('setting.value', selected.get('value') || '');
      this.sendAction('updateAction', this.get('setting'));
    }
  }
});
