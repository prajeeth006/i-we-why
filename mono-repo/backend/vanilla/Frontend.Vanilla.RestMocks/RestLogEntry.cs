using System;
using System.Collections.Generic;
using System.Net;

namespace Frontend.Vanilla.RestMocks;

public sealed class RestLogEntry
{
    public RestInfoLogEntry Info { get; set; }
    public RestRequestLogEntry Request { get; set; }
    public RestResponseLogEntry Response { get; set; }

    public override string ToString()
        => $"{Request.Method} {Request.Url} -> {Response.StatusCode} called from {Info.WebRequestUrl}";
}

public sealed class RestInfoLogEntry
{
    public DateTimeOffset Time { get; set; }
    public string CorrelationId { get; set; }
    public Uri WebRequestUrl { get; set; }
    public List<string> VanillaStackTrace { get; set; }
}

public sealed class RestRequestLogEntry
{
    public Uri Url { get; set; }
    public string Method { get; set; }
    public Dictionary<string, List<string>> Headers { get; set; }
    public string Content { get; set; }
}

public sealed class RestResponseLogEntry
{
    public HttpStatusCode StatusCode { get; set; }
}
