import Ember from 'ember';
import hiveParams from '../configs/hive-parameters'

export default Ember.Route.extend({
  model() {
    return this.store.findAll('setting').then(settings => settings.toArray());
  },
  setupController(controller, model) {
    this._super(...arguments);
    const appendedHiveParams = this.prepareExhaustiveParameters(hiveParams, model);
    controller.set('hiveParameters', appendedHiveParams);
  },

  prepareExhaustiveParameters(hiveParams, model) {
    let newHiveParams = [];
    newHiveParams.pushObjects(hiveParams);
    model.forEach(x => {
      let param = hiveParams.findBy('name', x.get('key'));

      if(Ember.isEmpty(param)) {
        newHiveParams.pushObject(
          Ember.Object.create({name: x.get('key'), disabled: true})
        );
      } else {
        param.set('disabled', true);
      }
    });
    return newHiveParams;
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
    },

    willTransition(transition) {
      let unsavedModels = this.get('controller.model').filterBy('isNew', true);
      unsavedModels.forEach(x => this.store.unloadRecord(x));
    }
  }
});
