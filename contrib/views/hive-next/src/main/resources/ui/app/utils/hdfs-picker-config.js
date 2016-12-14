import ViewerConfig from 'hdfs-directory-viewer/utils/viewer-config';

export default ViewerConfig.extend({
  store: null,

  showOnlyDirectories: true,

  expandIcon: 'fa fa-chevron-right',
  collapseIcon: 'fa fa-chevron-down',

  listDirectoryUrl(pathParams) {
    return `${this.get('store').adapterFor('hdfs-viewer').get('namespace')}?${pathParams}`;
  }
});
