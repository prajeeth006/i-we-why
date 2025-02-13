# Frontend.DeviceAtlas.Api

### Environments

- [DEV - https://deviceatlas.ait.env.works]
- [FVT - https://deviceatlas.test.env.works]
- [PROD - https://deviceatlas.prod.env.works]

### LOCO

Link [here](https://locov3.prod.env.works/share/9rgoz42k53)

### Endpoints

- `/health` - health endpoint
- `/site/check` - returns `CHECK_OK`
- `/site/version` - returns version information
- `/metrics` - exposes OpenTelemetry metrics
- `/`
  - when analysis of request headers (specific to device recognition - see below) succeeded returns `HTTP 200` with device capabilities
  - `HTTP 500` otherwise

### Request Headers

```
private static readonly HashSet<string> WhitelistedHeaders = new (StringComparer.OrdinalIgnoreCase)
    {
        "save-data",
        "sec-ch-ua",
        "sec-ch-ua-mobile",
        "sec-ch-ua-platform",
        "sec-ch-ua-full-version-list",
        "sec-ch-ua-model",
        "user-agent",
        "x-device-user-agent",
        "x-operamini-phone-ua",
        "x-original-user-agent",
        "device-stock-ua",
        "x-requested-with",
    };
```

### DeviceAtlas Data Refresh

Happens once per day. Data is (re)loaded from `MSSQL DB (BAWImport)`. Details about last data refresh are present on /health endpoint. If background refresh of data fails, it will be attempted again next day. When this happens, health status is reported as `DEGRADED`.

### Load Tests

Production setup of `4 servers` with hardware specs of `4 CPU and 8GB RAM` handles `1 million req/min` with hardware utilization of `CPU 40% and RAM 55%`.

### Consumers

At the moment, only consumers are `Vanilla Frontends`. Vanilla caches responses according to this [config](https://admin.dynacon.prod.env.works/services/198137/features/448785) in memory cache of each server.
