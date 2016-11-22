import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'a',
  classNames: ['list-group-item', 'am-view-list-item'],
  classNameBindings: ['selected:active'],
  selected: Ember.computed.oneWay('item.selected'),
  click() {
    this.sendAction('itemClicked', this.get('item'));
  }
});
