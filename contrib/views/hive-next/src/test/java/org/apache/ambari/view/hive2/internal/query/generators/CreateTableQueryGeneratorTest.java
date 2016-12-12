package org.apache.ambari.view.hive2.internal.query.generators;

import com.google.gson.Gson;
import org.apache.ambari.view.hive2.internal.dto.TableMeta;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by nrathore on 12/12/16.
 */
public class CreateTableQueryGeneratorTest {
  private static final Logger LOG = LoggerFactory.getLogger(CreateTableQueryGeneratorTest.class);

  @Test
  public void testGetQuery() throws Exception {
    String json = "{\n" +
      "\t\t\"id\": \"d1/t2\",\n" +
      "\t\t\"database\": \"d1\",\n" +
      "\t\t\"table\": \"t2\",\n" +
      "\t\t\"columns\": [{\n" +
      "\t\t\t\"name\": \"col_name1\",\n" +
      "\t\t\t\"type\": \"string\",\n" +
      "\t\t\t\"comment\": \"col_name1 comment\"\n" +
      "\t\t}, {\n" +
      "\t\t\t\"name\": \"col_name2\",\n" +
      "\t\t\t\"type\": \"decimal(10,2)\",\n" +
      "\t\t\t\"comment\": \"col_name2 comment\"\n" +
      "\t\t}],\n" +
      "\t\t\"ddl\": \"CREATE TABLE `t2`(\\n  `col_name1` string COMMENT \\u0027col_name1 comment\\u0027, \\n  `col_name2` decimal(10,2) COMMENT \\u0027col_name2 comment\\u0027)\\nCOMMENT \\u0027table t1 comment\\u0027\\nPARTITIONED BY ( \\n  `col_name3` string COMMENT \\u0027col_name3 comment\\u0027, \\n  `col_name4` char(1) COMMENT \\u0027col_name4 comment\\u0027)\\nCLUSTERED BY ( \\n  col_name1, \\n  col_name2) \\nSORTED BY ( \\n  col_name1 ASC, \\n  col_name2 DESC) \\nINTO 5 BUCKETS\\nROW FORMAT DELIMITED \\n  FIELDS TERMINATED BY \\u0027,\\u0027 \\nWITH SERDEPROPERTIES ( \\n  \\u0027escape.delim\\u0027\\u003d\\u0027\\\\\\\\\\u0027) \\nSTORED AS INPUTFORMAT \\n  \\u0027org.apache.hadoop.mapred.SequenceFileInputFormat\\u0027 \\nOUTPUTFORMAT \\n  \\u0027org.apache.hadoop.hive.ql.io.HiveSequenceFileOutputFormat\\u0027\\nLOCATION\\n  \\u0027hdfs://c6401.ambari.apache.org:8020/user/hive/tables/d1/t1\\u0027\\nTBLPROPERTIES (\\n  \\u0027NO_AUTO_COMPACTION\\u0027\\u003d\\u0027true\\u0027, \\n  \\u0027immutable\\u0027\\u003d\\u0027false\\u0027, \\n  \\u0027orc.compress\\u0027\\u003d\\u0027SNAPPY\\u0027, \\n  \\u0027transient_lastDdlTime\\u0027\\u003d\\u00271481520077\\u0027)\\n\",\n" +
      "\t\t\"partitionInfo\": {\n" +
      "\t\t\t\"columns\": [{\n" +
      "\t\t\t\t\"name\": \"col_name4\",\n" +
      "\t\t\t\t\"type\": \"char(1)\",\n" +
      "\t\t\t\t\"comment\": \"col_name4 comment\"\n" +
      "\t\t\t}, {\n" +
      "\t\t\t\t\"name\": \"col_name3\",\n" +
      "\t\t\t\t\"type\": \"string\",\n" +
      "\t\t\t\t\"comment\": \"col_name3 comment\"\n" +
      "\t\t\t}]\n" +
      "\t\t},\n" +
      "\t\t\"detailedInfo\": {\n" +
      "\t\t\t\"dbName\": \"d1\",\n" +
      "\t\t\t\"owner\": \"admin\",\n" +
      "\t\t\t\"createTime\": \"Mon Dec 12 05:21:17 UTC 2016\",\n" +
      "\t\t\t\"lastAccessTime\": \"UNKNOWN\",\n" +
      "\t\t\t\"retention\": \"0\",\n" +
      "\t\t\t\"tableType\": \"MANAGED_TABLE\",\n" +
      "\t\t\t\"location\": \"hdfs://c6401.ambari.apache.org:8020/user/hive/tables/d1/t1\",\n" +
      "\t\t\t\"parameters\": {\n" +
      "\t\t\t\t\"immutable\": \"false\",\n" +
      "\t\t\t\t\"orc.compress\": \"SNAPPY\",\n" +
      "\t\t\t\t\"transient_lastDdlTime\": \"1481520077\",\n" +
      "\t\t\t\t\"NO_AUTO_COMPACTION\": \"true\",\n" +
      "\t\t\t\t\"comment\": \"table t1 comment\",\n" +
      "\t\t\t\t\"SORTBUCKETCOLSPREFIX\": \"TRUE\"\n" +
      "\t\t\t}\n" +
      "\t\t},\n" +
      "\t\t\"storageInfo\": {\n" +
      "\t\t\t\"serdeLibrary\": \"org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe\",\n" +
      "\t\t\t\"inputFormat\": \"org.apache.hadoop.mapred.SequenceFileInputFormat\",\n" +
      "\t\t\t\"outputFormat\": \"org.apache.hadoop.hive.ql.io.HiveSequenceFileOutputFormat\",\n" +
      "\t\t\t\"compressed\": \"No\",\n" +
      "\t\t\t\"numBuckets\": \"5\",\n" +
      "\t\t\t\"bucketCols\": \"[col_name1, col_name2]\",\n" +
      "\t\t\t\"sortCols\": \"[Order(col:col_name1, order:1), Order(col:col_name2, order:0)]\",\n" +
      "\t\t\t\"parameters\": {\n" +
      "\t\t\t\t\"escape.delim\": \"\\\\\\\\\",\n" +
      "\t\t\t\t\"field.delim\": \",\",\n" +
      "\t\t\t\t\"serialization.format\": \",\"\n" +
      "\t\t\t}\n" +
      "\t\t}\n" +
      "\t}";
    TableMeta tableMeta = new Gson().fromJson(json, TableMeta.class);
    String createQuery = new CreateTableQueryGenerator(tableMeta).getQuery();
    LOG.info("createQuery : {}", createQuery);
  }
}