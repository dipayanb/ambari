import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: ['pullRight:pull-right', 'active'],
  pullRight: Ember.computed.readOnly('tab.pullRight'),
  active: Ember.computed.alias('tab.active'),

  didInsertElement: function() {
    Ember.run.later(() => this.send('changeActiveState'));
    this.$('a').click(() => {
      Ember.run.later(() => {
        this.send('changeActiveState');
      });
    });
  },

  actions : {
    changeActiveState: function() {
      let classes = this.$('a').attr('class').split(' ');
      if(classes.contains('active')) {
        this.get('tabs').forEach((x) => x.set('active', false));
        this.set('active', true);
      }
    }
  }
});
