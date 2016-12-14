import Ember from 'ember';
import fileFormats from '../configs/file-format';
import Helpers from '../configs/helpers';


export default Ember.Component.extend({

  classNames: ['create-table-advanced-wrap'],
  showLocationInput: false,
  showFileFormatInput: false,
  showRowFormatInput: false,

  settings: {},


  fileFormats: Ember.copy(fileFormats),
  terminationChars: Ember.computed(function () {
    return Helpers.getAllTerminationCharacters();
  }),

  didReceiveAttrs() {
    if (!Ember.isEmpty(this.get('settings.location'))) {
      this.set('showLocationInput', true);
    }
    if (!Ember.isEmpty(this.get('settings.fileFormat'))) {
      this.set('showFileFormatInput', true);
      let currentFileFormat = this.get('fileFormats').findBy('name', this.get('settings.fileFormat.type'));
      this.set('selectedFileFormat', currentFileFormat);
      this.set('customFileFormat', currentFileFormat.custom);
    }
    if (!Ember.isEmpty(this.get('settings.rowFormat'))) {
      this.set('showRowFormatInput', true);
      this.set('selectedFieldTerminator', this.get('settings.rowFormat.fieldTerminatedBy'));
      this.set('selectedCollectionItemTerminator', this.get('settings.rowFormat.fieldTerminatedBy'));
      this.set('selectedMapKeyTerminator', this.get('settings.rowFormat.mapKeyTerminatedBy'));
      this.set('selectedLinesTerminator', this.get('settings.rowFormat.linesTerminatedBy'));
      this.set('selectedNullDefinition', this.get('settings.rowFormat.nullDefinedAs'));
    }
  },

  locationInputObserver: Ember.observer('showLocationInput', function () {
    if (!this.get('showLocationInput')) {
      this.set('settings.location');
    }
  }),

  fileFormatInputObserver: Ember.observer('showFileFormatInput', function () {
    if (!this.get('showFileFormatInput')) {
      this.set('settings.fileFormat');
    } else {
      this.set('settings.fileFormat', {});
      this.set('selectedFileFormat', this.get('fileFormats').findBy('default', true));
    }
  }),

  rowFormatInputObserver: Ember.observer('showRowFormatInput', function () {
    if (!this.get('showRowFormatInput')) {
      this.send('clearFieldTerminator');
      this.send('clearCollectionItemTerminator');
      this.send('clearMapKeyTerminator');
      this.send('clearLinesTerminator');
      this.send('clearNullDefinition');
      this.set('settings.rowFormat');
    } else {
      this.set('settings.rowFormat', {});
    }
  }),

  actions: {

    closeHdfsModal() {
      this.set('showDirectoryViewer', false);
    },

    hdfsPathSelected(path) {
      this.set('settings.location', path);
      this.set('showDirectoryViewer', false);
    },

    toggleDirectoryViewer() {
      this.set('showDirectoryViewer', true);
    },

    toggleLocation() {
      this.toggleProperty('showLocationInput');
    },

    toggleFileFormat() {
      this.toggleProperty('showFileFormatInput')
    },

    toggleRowFormat() {
      this.toggleProperty('showRowFormatInput')
    },

    fileFormatSelected(format) {
      this.set('settings.fileFormat.type', format.name);
      this.set('selectedFileFormat', format);
      this.set('customFileFormat', format.custom);
    },

    fieldTerminatorSelected(terminator) {
      this.set('settings.rowFormat.fieldTerminatedBy', terminator);
      this.set('selectedFieldTerminator', terminator);
    },
    clearFieldTerminator() {
      this.set('settings.rowFormat.fieldTerminatedBy');
      this.set('selectedFieldTerminator');
    },

    collectionItemTerminatorSelected(terminator) {
      this.set('settings.rowFormat.collectionItemTerminatedBy', terminator);
      this.set('selectedCollectionItemTerminator', terminator);
    },
    clearCollectionItemTerminator() {
      this.set('settings.rowFormat.collectionItemTerminatedBy');
      this.set('selectedCollectionItemTerminator');
    },

    mapKeyTerminatorSelected(terminator) {
      this.set('settings.rowFormat.mapKeyTerminatedBy', terminator);
      this.set('selectedMapKeyTerminator', terminator);
    },
    clearMapKeyTerminator() {
      this.set('settings.rowFormat.mapKeyTerminatedBy');
      this.set('selectedMapKeyTerminator');
    },

    linesTerminatorSelected(terminator) {
      this.set('settings.rowFormat.linesTerminatedBy', terminator);
      this.set('selectedLinesTerminator', terminator);
    },
    clearLinesTerminator() {
      this.set('settings.rowFormat.linesTerminatedBy');
      this.set('selectedLinesTerminator');
    },

    nullDefinedAsSelected(terminator) {
      this.set('settings.rowFormat.nullDefinedAs', terminator);
      this.set('selectedNullDefinition', terminator);
    },
    clearNullDefinition() {
      this.set('settings.rowFormat.nullDefinedAs');
      this.set('selectedNullDefinition');
    },
  }
});
