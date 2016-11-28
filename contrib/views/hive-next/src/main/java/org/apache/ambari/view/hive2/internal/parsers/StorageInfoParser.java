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

package org.apache.ambari.view.hive2.internal.parsers;

import org.apache.ambari.view.hive2.client.Row;
import org.apache.ambari.view.hive2.internal.dto.StorageInfo;

import java.util.List;
import java.util.Map;

/**
 * Parses the Storage Information from the describe formatted output.
 */
public class StorageInfoParser extends AbstractTableMetaParser<StorageInfo> {


  public StorageInfoParser() {
    super("# Storage Information", null, "");
  }

  @Override
  public StorageInfo parse(List<Row> rows) {
    StorageInfo info = new StorageInfo();
    Map<String, Object> parsedSection = parseSection(rows);

    info.setSerdeLibrary(getString(parsedSection, "SerDe Library:"));
    info.setInputFormat(getString(parsedSection, "InputFormat:"));
    info.setOutputFormat(getString(parsedSection, "OutputFormat:"));
    info.setCompressed(getString(parsedSection, "Compressed:"));
    info.setNumBuckets(getString(parsedSection, "Num Buckets:"));
    info.setBucketCols(getString(parsedSection, "Bucket Columns:"));
    info.setSortCols(getString(parsedSection, "Sort Columns:"));
    info.setParameters(getMap(parsedSection, "Storage Desc Params:"));

    return info;
  }
}
