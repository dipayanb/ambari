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
import com.google.common.collect.FluentIterable;

import javax.annotation.Nullable;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class QueryGenerationUtils {
  public static boolean isNullOrEmpty(Map map) {
    return null != map && !map.isEmpty();
  }

  public static boolean isNullOrEmpty(Collection collection) {
    return null == collection || collection.isEmpty();
  }

  public static boolean isEqual(Map oldProps, Map newProps) {
    if(oldProps == null && newProps == null) return true;

    if(oldProps != null && newProps != null){
      if(oldProps.size() != newProps.size()) return false;

      Set<Map.Entry> entrySet = oldProps.entrySet();
      for(Map.Entry e : entrySet){
        Object key = e.getKey();
        if(oldProps.get(key) == null){
          if(newProps.get(key) != null) return false;
        }else {
          if (newProps.get(key) == null || !newProps.get(key).equals(oldProps.get(key))) {
            return false;
          }
        }
      }
    }

    return true;
  }

  public static String getPropertiesAsKeyValues(Map<String, String> parameters) {
    List<String> props = (List<String>) FluentIterable.from(parameters.entrySet())
            .transform(new Function<Map.Entry<String, String>, String>() {
              @Nullable
              @Override
              public String apply(@Nullable Map.Entry<String, String> entry) {
                return "'" + entry.getKey() + "'='" + entry.getValue() + "'";
              }
            }).toList();

    return Joiner.on(",").join(props);
  }
}
