/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.apache.ambari.view.hive2.internal;

import com.google.common.base.Optional;
import org.apache.ambari.view.hive2.internal.dto.ColumnInfo;
import org.apache.ambari.view.hive2.internal.dto.DatabaseInfo;
import org.apache.ambari.view.hive2.internal.dto.TableInfo;
import org.apache.hive.jdbc.HiveConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 *
 */
public class DatabaseMetaRetriever {

  private final Logger LOG = LoggerFactory.getLogger(getClass());

  private final Connectable connectable;

  public DatabaseMetaRetriever(Connectable connectable) {
    this.connectable = connectable;
  }

  public Set<DatabaseInfo> getMeta() throws ConnectionException, SQLException {
    LOG.info("Getting databases!!!");
    if (!connectable.isOpen()) {
      connectable.connect();
    }
    Optional<HiveConnection> connectionOptional = connectable.getConnection();
    HiveConnection connection = connectionOptional.get();
    return getDatabaseInfos(connection);
  }

  private Set<DatabaseInfo> getDatabaseInfos(HiveConnection connection) throws SQLException {
    Set<DatabaseInfo> infos = new HashSet<>();
    try (ResultSet schemas = connection.getMetaData().getSchemas()) {
      while (schemas.next()) {
        DatabaseInfo info = new DatabaseInfo(schemas.getString(1));
        infos.add(info);
      }
    }

    for (DatabaseInfo info : infos) {
      info.setTables(getTablesInfo(info.getName(), connection));
    }
    return infos;
  }

  private Set<TableInfo> getTablesInfo(String database, HiveConnection connection) throws SQLException {
    Set<TableInfo> infos = new HashSet<>();
    try (ResultSet tables = connection.getMetaData().getTables("", database, null, null)) {
      while(tables.next()) {
        TableInfo info = new TableInfo(tables.getString(3), tables.getString(4));
        infos.add(info);
      }
    }

    for(TableInfo info: infos) {
      info.setColumns(getColumnsInfo(database, info.getName(), connection));
    }
    return infos;
  }

  private Set<ColumnInfo> getColumnsInfo(String database, String tableName, HiveConnection connection) throws SQLException {
    Set<ColumnInfo> infos = new HashSet<>();
    try(ResultSet columns = connection.getMetaData().getColumns("", database, tableName, null)) {
      while(columns.next()) {
        ColumnInfo info = new ColumnInfo(columns.getString(4));
        info.setType(columns.getInt(5));
        info.setTypeName(columns.getString(6));
        info.setSize(columns.getInt(7));
        info.setNullable(columns.getString(18).equalsIgnoreCase("YES"));
        info.setAutoIncrement(columns.getString(23).equalsIgnoreCase("YES"));
        infos.add(info);
      }
    }
    return infos;
  }
}
