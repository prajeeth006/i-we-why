using System;
using System.Diagnostics.CodeAnalysis;
using Frontend.Vanilla.Core.Json;
using Frontend.Vanilla.Core.Json.Converters.Abstract;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Core.System.Uris;

/// <summary>
/// Represents an absolute URL with scheme http or https.
/// Used to express contract of an interfaced service explicitly, remove input validations and enforce exceptions early in consumers' unit tests if they pass invalid value.
/// </summary>
[JsonConverter(typeof(HttpUriJsonConverter))]
public class HttpUri : Uri
{
    /// <summary>Creates a new instance.</summary>
    public HttpUri(string uriString)
        : this(uriString, IsValid(uriString)) { }

    private HttpUri(string uriString, bool isValid)
        : base(isValid ? uriString : throw GetError(uriString, nameof(uriString))) { }

    /// <summary>Creates a new instance.</summary>
    public HttpUri(Uri uri)
        : this(IsValid(uri) ? uri.OriginalString : throw GetError(uri?.OriginalString, nameof(uri))) { }

    /// <summary>Tries to create a new instance.</summary>
    public static bool TryCreate(string? uriString, [NotNullWhen(true)] out HttpUri? result)
    {
        result = IsValid(uriString) ? new HttpUri(uriString, isValid: true) : null;

        return result != null;
    }

    private static bool IsValid([NotNullWhen(true)] string? uriString)
        => TryCreate(uriString, UriKind.Absolute, out var uri) && IsValid(uri);

    private static bool IsValid(Uri uri)
        => uri != null && uri.IsHttp();

    private static ArgumentException GetError(string? uriString, string paramName)
    {
        var message =
            $"Uri must be absolute one with scheme '{UriSchemeHttp}' or '{UriSchemeHttps}'.{Environment.NewLine}Actual value: {(uriString != null ? $"'{uriString}'" : "null")}";

        return new ArgumentException(message, paramName);
    }

    private sealed class HttpUriJsonConverter : JsonConverterBase<HttpUri>
    {
        public override HttpUri Read(JsonReader reader, Type objectType, JsonSerializer serializer)
            => new HttpUri(reader.GetRequiredValue<string>());

        public override void Write(JsonWriter writer, HttpUri value, JsonSerializer serializer)
            => writer.WriteValue(value);
    }
}
