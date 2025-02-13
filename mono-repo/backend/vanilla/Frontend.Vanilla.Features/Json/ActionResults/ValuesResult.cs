using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Features.Json.ActionResults;

/// <summary>
/// <see cref="IActionResult"/> decorator that adds errorValues for client to the response.
/// </summary>
public class ValuesResult : ExtendResultBase
{
    /// <summary>List of messages to add.</summary>
    public IReadOnlyDictionary<string, string?> Values { get; }

    /// <summary>Initializes a new instance.</summary>
    public ValuesResult(IActionResult innerResult, IReadOnlyDictionary<string, string?> values)
        : base(innerResult)
        => Values = values;

    /// <inheritdoc />
    protected override Task<IJsonResponseBodyExtensionWriter?> CreateWriter(HttpContext httpContext)
        => new ValuesResponseBodyExtensionWriter(Values).AsTask<IJsonResponseBodyExtensionWriter?>();
}

internal sealed class ValuesResponseBodyExtensionWriter(IReadOnlyDictionary<string, string?> values) : IJsonResponseBodyExtensionWriter
{
    internal IReadOnlyDictionary<string, string?> Values { get; } = values;

    public Task Write(JObject body, JsonSerializer serializer, CancellationToken cancellationToken)
    {
        if (body["errorValues"] == null)
        {
            body["errorValues"] = new JArray();
        }

        foreach (var value in Values)
        {
            var msg = new JObject
            {
                ["key"] = value.Key,
                ["value"] = value.Value,
            };

            ((JArray)body["errorValues"]!).Add(msg);
        }

        return Task.CompletedTask;
    }
}
