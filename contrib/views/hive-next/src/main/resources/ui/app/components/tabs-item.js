import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: ['pullRight:pull-right', 'active'],
  pullRight: Ember.computed.readOnly('tab.pullRight'),
  active: Ember.computed.alias('tab.active'),

  shouldTransition: Ember.computed('tab.transition', function() {
    if(!Ember.isEmpty(this.get('tab.transition'))) {
      return this.get('tab.transition');
    } else {
      return true;
    }
  }),

  didInsertElement: function() {
    Ember.run.later(() => this.send('changeActiveState'));
    this.$('a').click(() => {
      Ember.run.later(() => {
        this.send('changeActiveState');
      });
    });
  },

  actions : {
    selected() {
      this.get('tabs').forEach((x) => x.set('active', false));
      this.set('active', true);
      this.sendAction('activate', this.get('tab.link'));
    },

    changeActiveState: function() {
      if(this.get('shouldTransition')) {
        let classes = this.$('a').attr('class').split(' ');
        if(classes.contains('active')) {
          this.get('tabs').forEach((x) => x.set('active', false));
          this.set('active', true);
        }
      }
    }
  }
});
