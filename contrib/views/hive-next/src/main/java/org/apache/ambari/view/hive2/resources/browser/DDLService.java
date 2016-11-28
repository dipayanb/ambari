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

package org.apache.ambari.view.hive2.resources.browser;

import org.apache.ambari.view.hive2.BaseService;
import org.apache.ambari.view.hive2.ConnectionSystem;
import org.apache.ambari.view.hive2.client.ConnectionConfig;
import org.apache.ambari.view.hive2.client.DDLDelegator;
import org.apache.ambari.view.hive2.client.DDLDelegatorImpl;
import org.apache.ambari.view.hive2.internal.dto.DatabaseResponse;
import org.apache.ambari.view.hive2.internal.dto.TableMeta;
import org.apache.ambari.view.hive2.internal.dto.TableResponse;
import org.json.simple.JSONObject;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Set;

/**
 * Resource to get the DDL information for the database
 */
public class DDLService extends BaseService {

  private final DDLProxy proxy;

  @Inject
  public DDLService(DDLProxy proxy) {
    this.proxy = proxy;
  }


  @GET
  @Path("databases")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getDatabases(@QueryParam("like") String like) {
    Set<DatabaseResponse> infos = proxy.getDatabases();
    JSONObject response = new JSONObject();
    response.put("databases", infos);
    return Response.ok(response).build();
  }

  @GET
  @Path("databases/{database_id}")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getDatabase(@PathParam("database_id") String databaseId) {
    DatabaseResponse database = proxy.getDatabase(databaseId);
    JSONObject response = new JSONObject();
    response.put("database", database);
    return Response.ok(response).build();
  }



  @GET
  @Path("databases/{database_id}/tables")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getTables(@PathParam("database_id") String databaseName) {
    Set<TableResponse> tables = proxy.getTables(databaseName);
    JSONObject response = new JSONObject();
    response.put("tables", tables);
    return Response.ok(response).build();
  }

  @GET
  @Path("databases/{database_id}/tables/{table_id}")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getTable(@PathParam("database_id") String databaseName, @PathParam("table_id") String tableName) {
    TableResponse table = proxy.getTable(databaseName, tableName);
    JSONObject response = new JSONObject();
    response.put("table", table);
    return Response.ok(response).build();
  }

  @GET
  @Path("databases/{database_id}/tables/{table_id}/info")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getTableInfo(@PathParam("database_id") String databaseName, @PathParam("table_id") String tableName) {
    ConnectionConfig hiveConnectionConfig = getHiveConnectionConfig();
    DDLDelegator delegator = new DDLDelegatorImpl(context, ConnectionSystem.getInstance().getActorSystem(), ConnectionSystem.getInstance().getOperationController(context));
    TableMeta meta = proxy.getTableProperties(delegator, hiveConnectionConfig, databaseName, tableName);
    JSONObject response = new JSONObject();
    response.put("tableInfo", meta);
    return Response.ok(response).build();
  }
}
