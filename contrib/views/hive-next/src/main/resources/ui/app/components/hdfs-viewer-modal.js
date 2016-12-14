import Ember from 'ember';
import HdfsPickerConfig from '../utils/hdfs-picker-config';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  config: null,
  showSelectedPath: true,

  hdfsLocation: null,

  init() {
    this._super(...arguments);
    this.set('config', HdfsPickerConfig.create({store: this.get('store')}));
  },

  actions: {
    closeDirectoryViewer() {
      this.sendAction('close');
    },

    pathSelected() {
      this.sendAction('selected', this.get('hdfsLocation'));
    },

    viewerSelectedPath(data) {
      this.set('hdfsLocation', data.path);
    },

    viewerError(err) {
      console.log("Error", err);
    }
  }
});
