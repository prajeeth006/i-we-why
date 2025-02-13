using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.Primitives;

namespace Frontend.Vanilla.Core.Rest;

/// <summary>
/// The collection of HTTP headers usable with <see cref="IRestClient" />.
/// Adds custom validation on top of regular dictionary.
/// </summary>
public abstract class RestHeaders : DictionaryBase<string, StringValues>
{
    internal RestHeaders(IEnumerable<KeyValuePair<string, StringValues>>? headersToCopy)
        : base(headersToCopy, StringComparer.OrdinalIgnoreCase) { }

    /// <summary>Validates given header name.</summary>
    public override void ValidateKey(string key)
    {
        const string message = "HTTP header name can't be null, empty nor contain white-spaces.";
        Guard.Requires(key, _ => key.Length > 0 && !key.Any(char.IsWhiteSpace), nameof(key), message);
    }

    /// <summary>Returns concatenated string containing all header name and values.</summary>
    public override string ToString()
        => Count > 0 ? this.Select(h => $"{h.Key}={h.Value.Dump()}").Join() : "(empty)";

    internal void AddIfValueNotWhiteSpace(params (string Name, string Value)[] headersToAdd)
        => this.Add(headersToAdd.Where(h => !string.IsNullOrWhiteSpace(h.Value)).Select(h => (h.Name, (StringValues)h.Value)));
}

/// <summary>
/// The collection of HTTP request headers usable with <see cref="RestRequest" />.
/// Adds custom validation on top of regular dictionary.
/// </summary>
public sealed class RestRequestHeaders : RestHeaders
{
    /// <summary>Creates a new instance.</summary>
    public RestRequestHeaders(IEnumerable<KeyValuePair<string, StringValues>>? headersToCopy = null)
        : base(headersToCopy) { }

    /// <summary>Validates given header name.</summary>
    public override void ValidateKey(string key)
    {
        base.ValidateKey(key);

        const string message =
            "Particular HTTP header can't be specified in RestRequest.Headers because it's automatically calculated according to the RestRequest.Content.";
        Guard.Requires(key, h => !RestRequestConverter.CalculatedHeaders.Contains(h), nameof(key), message);
    }
}

/// <summary>
/// The collection of HTTP response headers usable with <see cref="RestResponse" />.
/// Adds custom validation on top of regular dictionary.
/// </summary>
public sealed class RestResponseHeaders : RestHeaders
{
    /// <summary>Creates a new instance.</summary>
    public RestResponseHeaders(IEnumerable<KeyValuePair<string, StringValues>>? headersToCopy = null)
        : base(headersToCopy) { }
}
