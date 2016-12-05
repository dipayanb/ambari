import Ember from 'ember';
import hiveParams from '../configs/hive-parameters'

export default Ember.Route.extend({
  model() {
    return this.store.findAll('setting').then(settings => settings.toArray());
  },
  setupController(controller, model) {
    this._super(...arguments);
    controller.set('hiveParameters', hiveParams);
  },

  actions: {
    addNewSettings() {
      let model = this.get('controller.model');
      model.forEach(x => x.rollbackAttributes());
      let newItem = this.store.createRecord('setting', {editMode: true});
      model.pushObject(newItem);
    },

    editAction(setting) {
      setting.set('editMode', true);
    },

    deleteAction(setting) {
      return setting.destroyRecord().then(data => {
        let model = this.get('controller.model');
        model.removeObject(data);
      }, err => {
        console.log('error in deletion');
      })
    },

    updateAction(newSetting) {
      newSetting.save().then(data => {
        console.log('saved', data);
        data.set('editMode', false);
      }, error => {
        console.log('error', err);
      })
    },

    cancelAction(newSetting) {
      if (newSetting.get('isNew')) {
        let model = this.get('controller.model');
        model.removeObject(newSetting);
      } else {
        newSetting.set('editMode', false);
      }
    }
  }
});
