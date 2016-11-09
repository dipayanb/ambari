import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'ul',
  classNames: ['row', 'nav', 'nav-tabs'],
  classNameBindings : ['inverse'],
  inverse: false,
  tabs: Ember.A()
});
