# Ui

To start the UI in development mode, developer has to proxy the xhr calls
to correct ambari endpoint.

**ember serve --proxy http://c6401.ambari.apache.org:8080/api/v1/views/HIVE/versions/{version}/instances/{instance_name}**

Example:
```
$ cd src/main/resources/ui
$ ember serve --proxy http://c6401.ambari.apache.org:8080/api/v1/views/HIVE/versions/1.5.0/instances/AUTO_HIVE_INSTANCE
```

