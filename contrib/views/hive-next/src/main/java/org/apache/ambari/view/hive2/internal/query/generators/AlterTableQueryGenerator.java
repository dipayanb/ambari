/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

package org.apache.ambari.view.hive2.internal.query.generators;

import com.google.common.base.Optional;
import com.google.common.base.Strings;
import org.apache.ambari.view.hive2.internal.dto.ColumnOrder;
import org.apache.ambari.view.hive2.internal.dto.TableMeta;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AlterTableQueryGenerator implements QueryGenerator{
  private final TableMeta oldMeta;
  private final TableMeta newMeta;

  public AlterTableQueryGenerator(TableMeta oldMeta, TableMeta newMeta){
    this.oldMeta = oldMeta;
    this.newMeta = newMeta;
  }

  public TableMeta getOldMeta() {
    return oldMeta;
  }

  public TableMeta getNewMeta() {
    return newMeta;
  }

  public String getQueryPerfix(){
    return new StringBuffer(" ALTER TABLE ")
      .append("`").append(this.getOldMeta().getDatabase()).append(".").append(this.getOldMeta().getTable().trim()).append("` ").toString();
  }
  public String getQuery(){
    Optional<String> tableRenameQuery = this.getTableRenameQuery();
    Optional<String> tablePropertiesQuery = this.getTablePropertiesQuery();
    Optional<String> serdeProperties = this.getSerdeQuery();
    Optional<String> storagePropertyQuery = this.getStoragePropertyQuery();

  }

  /**
   * ALTER TABLE table_name CLUSTERED BY (col_name, col_name, ...) [SORTED BY (col_name, ...)]
   INTO num_buckets BUCKETS;
   * @return
   */
  private Optional<String> getStoragePropertyQuery() {
    boolean foundDiff = false;
    List<String> oldBucketCols = this.getOldMeta().getStorageInfo().getBucketCols();
    List<ColumnOrder> oldSortCols = this.getOldMeta().getStorageInfo().getSortCols();
    String oldNumBuckets = this.getOldMeta().getStorageInfo().getNumBuckets();

    List<String> newBucketCols = this.getNewMeta().getStorageInfo().getBucketCols();
    List<ColumnOrder> newSortCols = this.getNewMeta().getStorageInfo().getSortCols();
    String newNumBuckets = this.getNewMeta().getStorageInfo().getNumBuckets();

    if(newBucketCols == null)

  }

  /**
   * assuming that getStorageInfo().getParameters() gives only serde properties
   * @return
   */
  private Optional<String> getSerdeQuery() {
    String query = "";
    String oldSerde = this.getOldMeta().getStorageInfo().getSerdeLibrary();
    String newSerde = this.getNewMeta().getStorageInfo().getSerdeLibrary();
    boolean serdeChanged = false;
    if(null != newSerde){
      serdeChanged = !newSerde.equals(oldSerde);
      query += " SET SERDE " + newSerde + " ";
    }
    Optional<Map<String, Map<Object, Object>>> diff = QueryGenerationUtils.findDiff(this.getOldMeta().getStorageInfo().getParameters(), this.getNewMeta().getStorageInfo().getParameters());
    if(diff.isPresent()){
      Map<String, Map<Object, Object>> diffMap = diff.get();
      Map<Object, Object> added = diffMap.get(QueryGenerationUtils.ADDED);
      Map<Object, Object> modified = diffMap.get(QueryGenerationUtils.MODIFIED);
      Map<Object, Object> deleted = diffMap.get(QueryGenerationUtils.DELETED);

      // TODO : how to handle deleted? actually I cannot find anything in hive alter table that will remove existing property
      Map addedOrModified = new HashMap<>(added);
      addedOrModified.putAll(modified);

      if( serdeChanged ){
        query += " WITH SERDEPROPERTIES ";
      }else{
        query += " SET SERDEPROPERTIES ";
      }
      query += " ( " + QueryGenerationUtils.getPropertiesAsKeyValues(addedOrModified) + " ) ";
    }

    if(!query.trim().isEmpty()){
      Optional.of(getQueryPerfix() + query);
    }

    return Optional.absent();
  }

  private Optional<String> getTablePropertiesQuery() {
    if(null != this.getOldMeta().getDetailedInfo() && !QueryGenerationUtils.isNullOrEmpty(this.getOldMeta().getDetailedInfo().getParameters())){
      Map oldProps = this.getOldMeta().getDetailedInfo().getParameters();
      Map newProps = this.getNewMeta().getDetailedInfo().getParameters();
      if(null == newProps){
        newProps = new HashMap();
      }

      if( !QueryGenerationUtils.isEqual(oldProps, newProps) ){
        return Optional.of(getQueryPerfix() + " SET TBLPROPERTIES " + QueryGenerationUtils.getPropertiesAsKeyValues(newProps));
      }
    }

    return Optional.absent();
  }

  private Optional<String> getTableRenameQuery(){
    if(!Strings.isNullOrEmpty(this.getOldMeta().getTable()) && !Strings.isNullOrEmpty(this.getNewMeta().getTable())){
      if( !this.getOldMeta().getTable().trim().equals(this.getNewMeta().getTable().trim())){
        return Optional.of( getQueryPerfix() + " RENAME TO " + this.getNewMeta().getTable().trim());
      }
    }

    return Optional.absent();
  }


}
