#nullable enable

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Json.Converters.Abstract;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Content.Model;

/// <summary>
/// A dictionary of sitecore messages/parameters list.
/// </summary>
[JsonConverter(typeof(ContentParametersJsonConverter))]
public sealed class ContentParameters : ReadOnlyDictionary<string, string?>
{
    internal static readonly StringComparer Comparer = StringComparer.OrdinalIgnoreCase;

    /// <summary>Creates a new instance.</summary>
    public ContentParameters(IEnumerable<KeyValuePair<string, string?>> dictionary)
        : base(dictionary.ToDictionary(Comparer)) { }

    /// <summary>Represents empty <see cref="ContentParameters"/>.</summary>
    public new static readonly ContentParameters Empty = new ContentParameters(EmptyDictionary<string, string?>.Singleton);

    private sealed class ContentParametersJsonConverter : JsonWriteConverter<ContentParameters>
    {
        public override void Write(JsonWriter writer, ContentParameters value, JsonSerializer serializer)
        {
            writer.WriteStartObject();

            foreach (var kv in value)
            {
                writer.WritePropertyName(kv.Key);
                writer.WriteValue(kv.Value);
            }

            writer.WriteEndObject();
        }
    }
}

/// <summary>Extensions for <see cref="ContentParameters"/>.</summary>
public static class ContentParametersExtensions
{
    /// <summary>Converts any <see cref="IDictionary{TKey,TValue}"/> or <see cref="IReadOnlyDictionary{TKey,TValue}"/> of string, string to <see cref="ContentParameters"/>.</summary>
    public static ContentParameters AsContentParameters(this IEnumerable<KeyValuePair<string, string?>> dictionary)
        => new ContentParameters(dictionary);
}
