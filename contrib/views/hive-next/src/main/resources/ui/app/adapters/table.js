import Ember from 'ember';
import DDLAdapter from './ddl';

export default DDLAdapter.extend({
  buildURL(modelName, id, snapshot, requestType, query) {
    // Check if the query is to find all tables for a particular database
    if(Ember.isEmpty(id) && requestType === 'query') {
      let dbId = query.databaseId;
      let origFindAllUrl = this._super(...arguments);
      let prefix = origFindAllUrl.substr(0, origFindAllUrl.lastIndexOf("/"));
      delete query.databaseId;
      return `${prefix}/databases/${dbId}/tables`;
    }
    return this._super(...arguments);
  }
});
