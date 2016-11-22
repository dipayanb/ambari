import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('jobs');
  this.route('udfs');
  this.route('settings');
  this.route('notifications');
  this.route('savedqueries');
  this.route('databases', function() {
    this.route('database', {path: '/:databaseId'}, function() {
      this.route('tables', {path: '/tables'});
    });

  });
});

export default Router;
