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
import org.apache.ambari.view.ViewContext;
import org.apache.ambari.view.hive2.AuthParams;
import org.apache.ambari.view.hive2.ConnectionFactory;
import org.apache.ambari.view.hive2.actor.message.HiveMessage;
import org.apache.ambari.view.hive2.client.ConnectionConfig;
import org.apache.ambari.view.hive2.internal.Connectable;
import org.apache.ambari.view.hive2.internal.ConnectionException;
import org.apache.ambari.view.hive2.internal.DatabaseMetaRetriever;
import org.apache.ambari.view.hive2.internal.HiveConnectionWrapper;
import org.apache.ambari.view.hive2.internal.dto.DatabaseInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Manages database related state, queries Hive to get the list of databases and then manages state for each database.
 * Also, periodically updates the list of databases by calling hive.
 */
public class DatabaseManager extends HiveActor {

  private final Logger LOG = LoggerFactory.getLogger(getClass());

  /**
   * Stores the list of each Database Actors
   */
  private final Map<String, ActorRef> databaseArrays = new HashMap<>();

  private final Connectable connectable;

  private Set<DatabaseInfo> databases = new HashSet<>();

  public DatabaseManager(Connectable connectable) {
    this.connectable = connectable;
  }

  @Override
  public void handleMessage(HiveMessage hiveMessage) {

    Object message = hiveMessage.getMessage();
    if(message instanceof Refresh) {
      handleRefresh();
    }

  }

  private void handleRefresh() {
    LOG.info("Received refresh for user");
    DatabaseMetaRetriever retriever = new DatabaseMetaRetriever(connectable);
    try {
      long current = System.currentTimeMillis();
      Set<DatabaseInfo> databaseInfos = retriever.getMeta();
      long timeTaken = System.currentTimeMillis() - current;
      LOG.info("Database Info: {}", databaseInfos);
      LOG.info("Database meta information retrieval took {} ms", timeTaken);
      updateState(databaseInfos);
    } catch (ConnectionException | SQLException e) {
      LOG.error("Failed to retrieve databases. Exception: {}", e);
    }
  }

  private void updateState(Set<DatabaseInfo> databaseInfos) {

  }

  @Override
  public void postStop() throws Exception {
    LOG.info("Database Manager stopped!!!");
    connectable.disconnect();
  }

  public static Props props(ViewContext context) {
    ConnectionConfig config = ConnectionFactory.create(context);
    Connectable connectable = new HiveConnectionWrapper(config.getJdbcUrl(), config.getUsername(), config.getPassword(), new AuthParams(context));
    return Props.create(DatabaseManager.class, connectable);
  }

  public static class Refresh {
    private final String username;

    public Refresh(String username) {
      this.username = username;
    }

    public String getUsername() {
      return username;
    }
  }
}
