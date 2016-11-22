import Ember from 'ember';

export default Ember.Route.extend({
 beforeModel() {
   let selectedDatabase = this.modelFor('databases').filterBy('selected', true).get('firstObject');
   this.transitionTo('databases.database', selectedDatabase.get('id'));
 }
});
