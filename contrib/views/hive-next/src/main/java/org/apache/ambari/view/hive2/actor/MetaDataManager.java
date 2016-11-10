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
import akka.actor.Cancellable;
import akka.actor.Props;
import org.apache.ambari.view.ViewContext;
import org.apache.ambari.view.hive2.actor.message.HiveMessage;
import org.apache.ambari.view.hive2.actor.message.Ping;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * Manages the Meta Information for Hive Server. Singleton actor which stores several DatabaseManagerActor in memory for
 * each user and instance name combination.
 */
public class MetaDataManager extends HiveActor {

  private final Logger LOG = LoggerFactory.getLogger(getClass());

  /**
   * Stores the sub database manager actors per user combination
   */
  private final Map<String, ActorRef> databaseManagers = new HashMap<>();
  private final Map<String, Cancellable> terminationSchedulers = new HashMap<>();
  private final ViewContext context;

  public MetaDataManager(ViewContext context) {
    this.context = context;
  }

  @Override
  public void handleMessage(HiveMessage hiveMessage) {

    Object message = hiveMessage.getMessage();
    if (message instanceof Ping) {
      handlePing((Ping)message);
    }

  }

  private void handlePing(Ping message) {
    LOG.info("Ping message received for user: {}, instance: {}", message.getUsername(), message.getInstanceName());
  }

  public static Props props(ViewContext viewContext) {
    return Props.create(MetaDataManager.class, viewContext);
  }
}
