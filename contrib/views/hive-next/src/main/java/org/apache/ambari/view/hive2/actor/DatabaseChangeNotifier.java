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

package org.apache.ambari.view.hive2.actor;

import akka.actor.ActorRef;
import akka.actor.Props;
import org.apache.ambari.view.hive2.actor.message.HiveMessage;
import org.apache.ambari.view.hive2.internal.dto.TableInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

/**
 *
 */
public class DatabaseChangeNotifier extends HiveActor {
  private final Logger LOG = LoggerFactory.getLogger(getClass());

  private Map<String, TableWrapper> tables = new HashMap<>();
  @Override
  public void handleMessage(HiveMessage hiveMessage) {
    Object message = hiveMessage.getMessage();
    if(message instanceof DatabaseAdded) {
      handleDatabaseAdded((DatabaseAdded) message);
    } else if ( message instanceof DatabaseRemoved) {
      handleDatabaseRemoved((DatabaseRemoved) message);
    } else if (message instanceof TableUpdated) {
      handleTableUpdated((TableUpdated) message);
    } else if (message instanceof AllTablesUpdated) {
      handleAllTableUpdated((AllTablesUpdated) message);
    }
  }

  private void handleDatabaseAdded(DatabaseAdded message) {
    LOG.info("Database Added: {}", message.name);
  }

  private void handleDatabaseRemoved(DatabaseRemoved message) {
    LOG.info("Database Removed: {}", message.name);
  }

  private void handleTableUpdated(TableUpdated message) {
    LOG.info("Table updated: {}", message.info.getName());
  }

  private void handleAllTableUpdated(AllTablesUpdated message) {
    LOG.info("All table updated for database: {}", message.database);
  }

  public static Props props() {
    return Props.create(DatabaseChangeNotifier.class);
  }

  public class TableWrapper {
    private final String tableName;
    private final ActorRef tableNotifier;

    private TableWrapper(String tableName) {
      this.tableName = tableName;
      this.tableNotifier = getContext().actorOf(TableChangeNotifier.props());
    }

    public String getTableName() {
      return tableName;
    }

    public ActorRef getTableNotifier() {
      return tableNotifier;
    }
  }

  public static class DatabaseAdded {
    private final String name;

    public DatabaseAdded(String name) {
      this.name = name;
    }
  }


  public static class DatabaseRemoved {
    private final String name;

    public DatabaseRemoved(String name) {
      this.name = name;
    }
  }

  public static class TableUpdated {
    private final TableInfo info;

    public TableUpdated(TableInfo info) {
      this.info = info;
    }
  }

  public static class AllTablesUpdated {
    private final String database;

    public AllTablesUpdated(String database) {
      this.database = database;
    }
  }
}
