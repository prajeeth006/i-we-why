using System;
using System.Collections.Generic;
using System.Net;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Diagnostics.Contracts.HttpRequest;

[method: JsonConstructor]
public sealed class HttpTesterResult(
    string? absoluteUrl,
    string content,
    TimeSpan executionDuration,
    Dictionary<string, string> headers,
    HttpStatusCode statusCode,
    string statusDescription)
{
    public string? AbsoluteUrl { get; } = absoluteUrl;
    public string Content { get; } = content;
    public TimeSpan ExecutionDuration { get; } = executionDuration;
    public uint Length { get; } = (uint)content.Length;
    public Dictionary<string, string> Headers { get; } = headers;
    public HttpStatusCode StatusCode { get; } = statusCode;
    public string StatusDescription { get; } = statusDescription;
}
