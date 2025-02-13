using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Features.Json.ActionResults;

/// <summary>
/// <see cref="IActionResult"/> decorator that adds key value message for client to the response.
/// </summary>
public sealed class KeyValueMessageResult : ExtendResultBase
{
    /// <summary>Scope of the message.</summary>
    public string Key { get; }

    /// <summary>Value.</summary>
    public string Value { get; }

    /// <summary>Initializes a new instance.</summary>
    public KeyValueMessageResult(IActionResult innerResult, string key, string value)
        : base(innerResult)
    {
        Key = key;
        Value = value;
    }

    /// <inheritdoc/>
    protected override Task<IJsonResponseBodyExtensionWriter?> CreateWriter(HttpContext httpContext)
    {
        return Task.FromResult<IJsonResponseBodyExtensionWriter?>(new KeyValueMessageResponseBodyExtensionWriter(Key, Value));
    }
}

internal class KeyValueMessageResponseBodyExtensionWriter(string key, string value) : IJsonResponseBodyExtensionWriter
{
    internal string Key { get; } = key;
    internal string Value { get; } = value;

    public Task Write(JObject body, JsonSerializer serializer, CancellationToken cancellationToken)
    {
        body[Key] = Value;

        return Task.CompletedTask;
    }
}
