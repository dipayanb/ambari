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
import org.apache.ambari.view.hive2.internal.dto.TableMeta;

import java.util.HashMap;
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

  public String getQuery(){
    StringBuffer query = new StringBuffer(" ALTER TABLE ");
    query.append("`").append(this.getOldMeta().getDatabase()).append(".").append(this.getOldMeta().getTable().trim()).append("`");
    Optional<String> tableRenameQuery = this.getTableRenameQuery();
    if(tableRenameQuery.isPresent()){
      query.append(tableRenameQuery.get());
    }

    Optional<String> tablePropertiesQuery = this.getTablePropertiesQuery();

  }

  private Optional<String> getTablePropertiesQuery() {
    if(null != this.getOldMeta().getDetailedInfo() && !QueryGenerationUtils.isNullOrEmpty(this.getOldMeta().getDetailedInfo().getParameters())){
      Map oldProps = this.getOldMeta().getDetailedInfo().getParameters();
      Map newProps = this.getNewMeta().getDetailedInfo().getParameters();
      if(null == newProps){
        newProps = new HashMap();
      }

      if( !QueryGenerationUtils.isEqual(oldProps, newProps) ){
        return Optional.of(" SET TBLPROPERTIES " + QueryGenerationUtils.getPropertiesAsKeyValues(newProps));
      }
    }

    return Optional.absent();
  }

  private Optional<String> getTableRenameQuery(){
    if(!Strings.isNullOrEmpty(this.getOldMeta().getTable()) && !Strings.isNullOrEmpty(this.getNewMeta().getTable())){
      if( !this.getOldMeta().getTable().trim().equals(this.getNewMeta().getTable().trim())){
        return Optional.of(" RENAME TO " + this.getNewMeta().getTable().trim());
      }
    }

    return Optional.absent();
  }


}
