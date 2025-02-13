using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Diagnostics.Contracts.Content;

public sealed class ContentTestResultDto(
    string status,
    string? documentType,
    JObject? serverDocument,
    JObject? clientDocument,
    IEnumerable<string> errors,
    string? sitecoreLoadTime,
    Uri? requestUrl,
    JToken trace,
    string? conditionResultType)
{
    public string Status { get; } = status;
    public string? DocumentType { get; } = documentType;
    public JObject? ServerDocument { get; } = serverDocument;
    public JObject? ClientDocument { get; } = clientDocument;
    public IReadOnlyList<string> Errors { get; } = errors.ToList();
    public string? SitecoreLoadTime { get; } = sitecoreLoadTime;
    public Uri? RequestUrl { get; } = requestUrl;
    public JToken Trace { get; } = trace;
    public string? ConditionResultType { get; } = conditionResultType;
}
