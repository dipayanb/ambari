import Ember from 'ember';
import DDLAdapter from './ddl';

export default DDLAdapter.extend({

  buildURL(modelName, id, snapshot, requestType, query) {
    // Check if the query is to find all tables for a particular database
    if(Ember.isEmpty(id) && (requestType === 'query' || requestType == 'queryRecord')) {
      let dbId = query.databaseId;
      let tableName = query.tableName;
      let origFindAllUrl = this._super(...arguments);
      let prefix = origFindAllUrl.substr(0, origFindAllUrl.lastIndexOf("/"));
      delete query.databaseId;
      delete query.tableName;
      return `${prefix}/databases/${dbId}/tables/${tableName}/info`;
    }
    return this._super(...arguments);
  }
});
