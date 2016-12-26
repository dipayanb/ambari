import Ember from 'ember';

export default Ember.Service.extend({
  store: Ember.inject.service(),

  submitCreateTable(database, settings) {
    let detailedInfo = this._getDetailedInfo(settings);
    let storageInfo = this._getStorageInfo(settings);
    let columns = this._getColumns(settings);

    let tableInfo = Ember.Object.create({
      database: database,
      table: settings.name,
      columns: columns,
      detailedInfo: detailedInfo,
      storageInfo: storageInfo
    });

    return new Promise( (resolve, reject) => {
      this.get('store').adapterFor('table').createTable(tableInfo).then(function(data) {
        console.log('created');
        resolve('created');
      }, function(err) {
        reject(err);
      });
    });
  },

  waitForJobFinish(jobId) {
    return new Promise(function (resolve, reject) {

    });
  },

  _getDetailedInfo(settings) {
    let detailedInfo = {};
    detailedInfo['parameters'] = this._getTableProperties(settings);

    if (!Ember.isEmpty(settings.settings.location)) {
      detailedInfo['location'] = settings.settings.location;
    }

    return detailedInfo;

  },

  _getStorageInfo(settings) {
    const storageSettings = settings.settings;
    let storageInfo = {};
    let parameters = {};

    if (!(Ember.isEmpty(storageSettings.fileFormat) || Ember.isEmpty(storageSettings.fileFormat.type))) {
      storageInfo.fileFormat = storageSettings.fileFormat.type;
      if (storageSettings.fileFormat.type === 'CUSTOM Serde') {
        storageInfo.inputFormat = storageSettings.inputFormat;
        storageInfo.outputFormat = storageSettings.outputFormat;
      }
    }

    if (!Ember.isEmpty(storageSettings.rowFormat)) {
      let addParameters = false;
      if(!Ember.isEmpty(storageSettings.rowFormat.fieldTerminatedBy)) {
        parameters['field.delim'] = storageSettings.rowFormat.fieldTerminatedBy.id;
        addParameters = true;
      }

      if(!Ember.isEmpty(storageSettings.rowFormat.linesTerminatedBy)) {
        parameters['line.delim'] = storageSettings.rowFormat.linesTerminatedBy.id;
        addParameters = true;
      }

      if(!Ember.isEmpty(storageSettings.rowFormat.nullDefinedAs)) {
        parameters['serialization.null.format'] = storageSettings.rowFormat.fieldTerminatedBy.id;
        addParameters = true;
      }

      if(!Ember.isEmpty(storageSettings.rowFormat.escapeDefinedAs)) {
        parameters['escape.delim'] = storageSettings.rowFormat.linesTerminatedBy.id;
        addParameters = true;
      }

      if(addParameters) {
        storageInfo.parameters = parameters;
      }
    }
    return storageInfo;
  },

  _getColumns(settings) {
    return settings.columns.map((column) => {
      return {
        name: column.get('name'),
        type: column.get('type.label'),
        comment: column.get('comment'),
        precision: column.get('precision'),
        scale: column.get('scale')
      }
    });
  },

  _getTableProperties(settings) {
    let properties = {};
    settings.properties.forEach(function (property) {
      properties[property.key] = property.value;
    });

    if (settings.settings.transactional) {
      if (Ember.isEmpty(properties['transactional'])) {
        properties['transactional'] = true;
      }
    }

    return properties;
  }


});
