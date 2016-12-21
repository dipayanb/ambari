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

import com.google.common.base.Function;
import com.google.common.base.Joiner;
import com.google.common.base.Optional;
import com.google.common.base.Strings;
import com.google.common.collect.FluentIterable;
import org.apache.ambari.view.hive2.internal.dto.ColumnInfo;
import org.apache.ambari.view.hive2.internal.dto.ColumnOrder;
import org.apache.ambari.view.hive2.internal.dto.TableMeta;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Nullable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import static org.apache.ambari.view.hive2.internal.query.generators.QueryGenerationUtils.isNullOrEmpty;

public class AlterTableQueryGenerator implements QueryGenerator {
  private static final Logger LOG = LoggerFactory.getLogger(AlterTableQueryGenerator.class);

  private final TableMeta oldMeta;
  private final TableMeta newMeta;

  public AlterTableQueryGenerator(TableMeta oldMeta, TableMeta newMeta) {
    this.oldMeta = oldMeta;
    this.newMeta = newMeta;
  }

  public TableMeta getOldMeta() {
    return oldMeta;
  }

  public TableMeta getNewMeta() {
    return newMeta;
  }

  public String getQueryPerfix() {
    return new StringBuffer(" ALTER TABLE ")
      .append("`").append(this.getOldMeta().getDatabase()).append(".").append(this.getOldMeta().getTable().trim()).append("` ").toString();
  }

  public String getQuery() {
    List<Optional<String>> queries = new LinkedList<>();

    Optional<String> tableRenameQuery = this.getTableRenameQuery(this.getOldMeta().getDatabase(),
      this.getOldMeta().getTable(), this.getNewMeta().getDatabase(), this.getNewMeta().getTable());
    queries.add(tableRenameQuery);

    if (null != this.getNewMeta().getDetailedInfo() && null != this.getNewMeta().getDetailedInfo()) {
      Optional<String> tablePropertiesQuery = this.getTablePropertiesQuery(this.getOldMeta().getDetailedInfo().getParameters(),
        this.getNewMeta().getDetailedInfo().getParameters());
      queries.add(tablePropertiesQuery);
    }

    if (null != this.getOldMeta().getStorageInfo()) {
      String oldSerde = this.getOldMeta().getStorageInfo().getSerdeLibrary();
      String newSerde = this.getNewMeta().getStorageInfo().getSerdeLibrary();
      Map<String, String> oldParameters = this.getOldMeta().getStorageInfo().getParameters();
      Map<String, String> newParameters = this.getNewMeta().getStorageInfo().getParameters();

      Optional<String> serdeProperties = this.getSerdeQuery(oldSerde, oldParameters, newSerde, newParameters);
      queries.add(serdeProperties);
    }

    if (null != this.getOldMeta().getStorageInfo() && null != this.getNewMeta().getStorageInfo()) {
      List<String> oldBucketCols = this.getOldMeta().getStorageInfo().getBucketCols();
      List<ColumnOrder> oldSortCols = this.getOldMeta().getStorageInfo().getSortCols();
      String oldNumBuckets = this.getOldMeta().getStorageInfo().getNumBuckets();

      List<String> newBucketCols = this.getNewMeta().getStorageInfo().getBucketCols();
      List<ColumnOrder> newSortCols = this.getNewMeta().getStorageInfo().getSortCols();
      String newNumBuckets = this.getNewMeta().getStorageInfo().getNumBuckets();

      Optional<String> storagePropertyQuery = this.getStoragePropertyQuery(oldBucketCols, oldSortCols, oldNumBuckets, newBucketCols, newSortCols, newNumBuckets);
      queries.add(storagePropertyQuery);
    }

    Optional<String> columnQuery = this.getColumnQuery(this.getOldMeta().getColumns(), this.getNewMeta().getColumns());
  }

  enum Action {
    INSERT,
    REPLACE,
    REMOVE,
    NOTHING
  }

  class ObjectAction<T> {
    private T fromObject;
    private T toObject;
    private Action action;

    public ObjectAction(T fromObject, T toObject, Action action) {
      this.fromObject = fromObject;
      this.toObject = toObject;
      this.action = action;
    }

    public T getFromObject() {
      return fromObject;
    }

    public void setToObject(T toObject) {
      this.toObject = toObject;
    }

    public T getToObject() {
      return toObject;
    }

    public void setFromObject(T fromObject) {
      this.fromObject = fromObject;
    }

    public Action getAction() {
      return action;
    }

    public void setAction(Action action) {
      this.action = action;
    }
  }

  class EditResult<T> {
    private List<ObjectAction<T>> objectActionList;
    private int editCount;
    private int m; // index of first array
    private int n; // index of second array

    public EditResult(List<ObjectAction<T>> objectActionList, int editCount, int m, int n) {
      this.objectActionList = objectActionList;
      this.editCount = editCount;
      this.m = m;
      this.n = n;
    }

    public List<ObjectAction<T>> getObjectActionList() {
      return objectActionList;
    }

    public void setObjectAction(List<ObjectAction<T>> objectActionList) {
      this.objectActionList = objectActionList;
    }

    public int getEditCount() {
      return editCount;
    }

    public void setEditCount(int editCount) {
      this.editCount = editCount;
    }

    public int getM() {
      return m;
    }

    public void setM(int m) {
      this.m = m;
    }

    public int getN() {
      return n;
    }

    public void setN(int n) {
      this.n = n;
    }

    @Override
    public boolean equals(Object o) {
      if (this == o) return true;
      if (!(o instanceof EditResult)) return false;

      EditResult<?> that = (EditResult<?>) o;

      if (getM() != that.getM()) return false;
      return getN() == that.getN();

    }

    @Override
    public int hashCode() {
      int result = getM();
      result = 31 * result + getN();
      return result;
    }
  }

  class ObjectPair<First, Second> {
    private First first;
    private Second second;

    public ObjectPair(First first, Second second) {
      this.first = first;
      this.second = second;
    }

    public First getFirst() {
      return first;
    }

    public void setFirst(First first) {
      this.first = first;
    }

    public Second getSecond() {
      return second;
    }

    public void setSecond(Second second) {
      this.second = second;
    }

    @Override
    public boolean equals(Object o) {
      if (this == o) return true;
      if (!(o instanceof ObjectPair)) return false;

      ObjectPair<?, ?> that = (ObjectPair<?, ?>) o;

      if (getFirst() != null ? !getFirst().equals(that.getFirst()) : that.getFirst() != null) return false;
      return getSecond() != null ? getSecond().equals(that.getSecond()) : that.getSecond() == null;

    }

    @Override
    public int hashCode() {
      int result = getFirst() != null ? getFirst().hashCode() : 0;
      result = 31 * result + (getSecond() != null ? getSecond().hashCode() : 0);
      return result;
    }
  }

  private <T> List<ObjectAction<T>> findEditDistance(ArrayList<T> from, ArrayList<T> to, int m, int n) {
    EditResult<T> result = findEditDistance(from, to, m, n, new HashMap<ObjectPair<Integer, Integer>, EditResult<T>>());
    return result.getObjectActionList();
  }

  private <T> EditResult<T> findEditDistance(ArrayList<T> from, ArrayList<T> to, int m, int n, Map<ObjectPair<Integer, Integer>, EditResult<T>> cachedResults) {
    EditResult<T> cachedResult = cachedResults.get(new ObjectPair<Integer, Integer>(m, n));
    if (null != cachedResult) {
      return cachedResult;
    }

    EditResult<T> result = new EditResult<>(new LinkedList<ObjectAction<T>>(), 0, m, n);
    if (n == 0) {
      for (int i = m - 1; i >= 0; i--) {
        result.getObjectActionList().add(new ObjectAction<T>(from.get(i), null, Action.REMOVE));
        result.setEditCount(result.getEditCount() + 1);
      }
      cachedResults.put(new ObjectPair<Integer, Integer>(m, n), result);
      return result;
    }

    if (m == 0) {
      for (int i = n - 1; i >= 0; i--) {
        result.getObjectActionList().add(new ObjectAction<T>(null, to.get(i), Action.INSERT));
        result.setEditCount(result.getEditCount() + 1);
      }
      cachedResults.put(new ObjectPair<Integer, Integer>(m, n), result);
      return result;
    }

    if (from.get(m - 1).equals(to.get(n - 1))) {
      EditResult<T> partialResult = findEditDistance(from, to, m - 1, n - 1, cachedResults);
      result.getObjectActionList().addAll(partialResult.getObjectActionList());
      result.setEditCount(partialResult.getEditCount());

      result.getObjectActionList().add(new ObjectAction<T>(from.get(m - 1), null, Action.NOTHING));
      result.setEditCount(result.getEditCount() + 1);

      cachedResults.put(new ObjectPair<Integer, Integer>(m, n), result);
      return result;
    }

    EditResult<T> addedResult = findEditDistance(from, to, m, n - 1, cachedResults);
    EditResult<T> replaceResult = findEditDistance(from, to, m - 1, n - 1, cachedResults);
    EditResult<T> deleteResult = findEditDistance(from, to, m - 1, n, cachedResults);

    EditResult<T> maxResult = null;
    if (addedResult.getEditCount() > replaceResult.getEditCount()) {
      if (addedResult.getEditCount() > deleteResult.getEditCount()) {
        maxResult = addedResult;
      } else {
        maxResult = deleteResult;
      }
    } else if (replaceResult.getEditCount() > deleteResult.getEditCount()) {
      maxResult = replaceResult;
    } else {
      maxResult = deleteResult;
    }

    result.getObjectActionList().addAll(maxResult.getObjectActionList());
    result.setEditCount(maxResult.getEditCount());

    result.setEditCount(result.getEditCount() + 1);
    if (maxResult == addedResult) {
      result.getObjectActionList().add(new ObjectAction<T>(null, to.get(n - 1), Action.INSERT));
    }
    if (maxResult == deleteResult) {
      result.getObjectActionList().add(new ObjectAction<T>(from.get(m - 1), null, Action.REMOVE));
    }
    if (maxResult == replaceResult) {
      result.getObjectActionList().add(new ObjectAction<T>(from.get(m - 1), to.get(n - 1), Action.REPLACE));
    }

    cachedResults.put(new ObjectPair<Integer, Integer>(m, n), result);
    return result;
  }

  /**
   * TODO : this uses CASCADE. confirm that it is expected.
   * ALTER TABLE table_name [PARTITION partition_spec] CHANGE [COLUMN] col_old_name col_new_name column_type
   [COMMENT col_comment] [FIRST|AFTER column_name] [CASCADE|RESTRICT];
   * @param oldColumns
   * @param newColumns
   * @return
   */
  private Optional<String> getColumnQuery(List<ColumnInfo> oldColumns, List<ColumnInfo> newColumns) {
    if (isNullOrEmpty(oldColumns) || isNullOrEmpty(newColumns)) {
      LOG.error("oldColumns = {} or newColumns = {} was null.", oldColumns, newColumns);
      throw new IllegalArgumentException("Old or new columns cannot be empty.");
    }

    List<ObjectAction<ColumnInfo>> columnActions = findEditDistance(new ArrayList<>(oldColumns), new ArrayList<>(newColumns), oldColumns.size(), newColumns.size());

    if( isNullOrEmpty(columnActions) ){
      return Optional.absent();
    }

    StringBuilder queryBuilder = new StringBuilder();
    ColumnInfo lastExisting = null;
    for(int i = 0 ; i < columnActions.size() ; i++ ){
      ObjectAction<ColumnInfo> curr = columnActions.get(i);
      StringBuilder partialQuery = new StringBuilder();
      switch(curr.getAction()){
        case INSERT:
          partialQuery.append(getQueryPerfix());

      }
    }
  }

  /**
   * ALTER TABLE table_name CLUSTERED BY (col_name, col_name, ...) [SORTED BY (col_name, ...)]
   * INTO num_buckets BUCKETS;
   *
   * @param oldBucketCols
   * @param oldSortCols
   * @param oldNumBuckets
   * @param newBucketCols
   * @param newSortCols
   * @param newNumBuckets
   * @return
   */
  private Optional<String> getStoragePropertyQuery(List<String> oldBucketCols, List<ColumnOrder> oldSortCols, String oldNumBuckets, List<String> newBucketCols, List<ColumnOrder> newSortCols, String newNumBuckets) {
    StringBuilder queryBuilder = new StringBuilder();
    boolean foundDiff = false;

    if (isNullOrEmpty(newBucketCols)) {
      if (!isNullOrEmpty(oldBucketCols)) {
        // TODO : all cols removed. how to handle this. Ignoring
        LOG.error("cannot handle removal of all the columns from buckets.");
        throw new IllegalArgumentException("removing all columns from CLUSTERED BY not allowed.");
      } else {
        // NOTHING ADDED to CLUSTERED BY.
        return Optional.absent();
      }
    } else {
      queryBuilder.append(" CLUSTERED BY ( ").append(Joiner.on(",").join(newBucketCols)).append(" ) ");
    }

    if (!isNullOrEmpty(newSortCols)) {
      queryBuilder.append(" SORTED BY ( ")
        .append(Joiner.on(",").join(FluentIterable.from(newSortCols).transform(new Function<ColumnOrder, String>() {
          @Nullable
          @Override
          public String apply(@Nullable ColumnOrder input) {
            return input.getColumnName() + " " + input.getOrder().name();
          }
        })))
        .append(" ) ");
    }

    if (Strings.isNullOrEmpty(newNumBuckets)) {
      LOG.error("Number of buckets cannot be empty if CLUSTERED BY is mentioned.");
      throw new IllegalArgumentException("Number of buckets cannot be empty.");
    } else {
      queryBuilder.append(" INTO ").append(newNumBuckets).append(" BUCKETS ");
    }

    return Optional.of(getQueryPerfix() + queryBuilder.toString());
  }

  /**
   * assuming that getStorageInfo().getParameters() gives only serde properties
   *
   * @return
   */
  private Optional<String> getSerdeQuery(String oldSerde, Map<String, String> oldParameters, String newSerde, Map<String, String> newParameters) {
    String query = "";
    boolean serdeChanged = false;
    if (null != newSerde) {
      serdeChanged = !newSerde.equals(oldSerde);
      query += " SET SERDE " + newSerde + " ";
    }
    Optional<Map<String, Map<Object, Object>>> diff = QueryGenerationUtils.findDiff(oldParameters, newParameters);
    if (diff.isPresent()) {
      Map<String, Map<Object, Object>> diffMap = diff.get();
      Map<Object, Object> added = diffMap.get(QueryGenerationUtils.ADDED);
      Map<Object, Object> modified = diffMap.get(QueryGenerationUtils.MODIFIED);
      Map<Object, Object> deleted = diffMap.get(QueryGenerationUtils.DELETED);

      // TODO : how to handle deleted? actually I cannot find anything in hive alter table that will remove existing property
      Map addedOrModified = new HashMap<>(added);
      addedOrModified.putAll(modified);

      if (serdeChanged) {
        query += " WITH SERDEPROPERTIES ";
      } else {
        query += " SET SERDEPROPERTIES ";
      }
      query += " ( " + QueryGenerationUtils.getPropertiesAsKeyValues(addedOrModified) + " ) ";
    }

    if (!query.trim().isEmpty()) {
      Optional.of(getQueryPerfix() + query);
    }

    return Optional.absent();
  }

  private Optional<String> getTablePropertiesQuery(Map oldProps, Map newProps) {
    if (null == newProps) {
      newProps = new HashMap();
    }

    if (!QueryGenerationUtils.isEqual(oldProps, newProps)) {
      return Optional.of(getQueryPerfix() + " SET TBLPROPERTIES " + QueryGenerationUtils.getPropertiesAsKeyValues(newProps));
    }

    return Optional.absent();
  }

  private Optional<String> getTableRenameQuery(String oldDatabaseName, String oldTableName, String newDatabaseName, String newTableName) {
    if (Strings.isNullOrEmpty(oldTableName) || Strings.isNullOrEmpty(newTableName)) {
      LOG.error("oldTableName or newTableName is empty : {}, {} ", oldTableName, newTableName);
      throw new IllegalArgumentException("oldTableName and newTableName both should be non empty.");
    }

    String oldName = (null != oldDatabaseName ? oldDatabaseName.trim() + "." : "") + oldTableName.trim();
    String newName = (null != newDatabaseName ? newDatabaseName.trim() + "." : "") + newTableName.trim();

    if (!oldName.equals(newName)) {
      return Optional.of(getQueryPerfix() + " RENAME TO " + newName);
    }

    return Optional.absent();
  }
}
