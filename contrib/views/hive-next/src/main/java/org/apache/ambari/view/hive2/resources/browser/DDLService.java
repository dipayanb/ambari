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
import org.apache.ambari.view.hive2.client.ConnectionConfig;
import org.apache.ambari.view.hive2.exceptions.ServiceException;
import org.apache.ambari.view.hive2.internal.dto.DatabaseResponse;
import org.apache.ambari.view.hive2.internal.dto.TableMeta;
import org.apache.ambari.view.hive2.internal.dto.TableResponse;
import org.apache.ambari.view.hive2.resources.jobs.viewJobs.Job;
import org.apache.ambari.view.hive2.resources.jobs.viewJobs.JobImpl;
import org.apache.ambari.view.hive2.resources.jobs.viewJobs.JobResourceManager;
import org.apache.ambari.view.hive2.utils.ServiceFormattedException;
import org.apache.ambari.view.hive2.utils.SharedObjectsFactory;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
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
  private JobResourceManager resourceManager;

  protected final static Logger LOG =
    LoggerFactory.getLogger(DDLService.class);

  protected synchronized JobResourceManager getResourceManager() {
    if (resourceManager == null) {
      SharedObjectsFactory connectionsFactory = getSharedObjectsFactory();
      resourceManager = new JobResourceManager(connectionsFactory, context);
    }
    return resourceManager;
  }

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

  @POST
  @Path("databases/{database_id}/tables")
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
  public Response createTable(@PathParam("database_id") String databaseName, TableMetaRequest request) {
    try {
    Job job = proxy.createTable(databaseName, request.tableInfo, getResourceManager());
    JSONObject response = new JSONObject();
    response.put("job", job);
    return Response.status(Response.Status.ACCEPTED).entity(job).build();
    } catch (ServiceException e) {
      LOG.error("Exception occurred while creatint table for db {} with details : {}", databaseName, request.tableInfo, e);
      throw new ServiceFormattedException(e);
    }
  }

  @GET
  @Path("databases/{database_id}/tables/{table_id}")
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
  public Response getTable(@PathParam("database_id") String databaseName, @PathParam("table_id") String tableName) {
    TableResponse table = proxy.getTable(databaseName, tableName);
    JSONObject response = new JSONObject();
    response.put("table", table);
    return Response.ok(response).build();
  }

  @DELETE
  @Path("databases/{database_id}/tables/{table_id}")
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
  public Response deleteTable(@PathParam("database_id") String databaseName, @PathParam("table_id") String tableName) {
    try {
    Job job = proxy.deleteTable(databaseName, tableName, getResourceManager());
    JSONObject response = new JSONObject();
    response.put("job", job);
    return Response.status(Response.Status.ACCEPTED).entity(response).build();
    } catch (ServiceException e) {
      LOG.error("Exception occurred while deleting table for db {}, tableName : {}", databaseName, tableName, e);
      throw new ServiceFormattedException(e);
    }
  }

  @GET
  @Path("databases/{database_id}/tables/{table_id}/info")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getTableInfo(@PathParam("database_id") String databaseName, @PathParam("table_id") String tableName) {
    ConnectionConfig hiveConnectionConfig = getHiveConnectionConfig();
    TableMeta meta = proxy.getTableProperties(context, hiveConnectionConfig, databaseName, tableName);
    JSONObject response = new JSONObject();
    response.put("tableInfo", meta);
    return Response.ok(response).build();
  }


  /**
   * Wrapper class for table meta request
   */
  public static class TableMetaRequest {
    public TableMeta tableInfo;
  }
}
